import * as RDF from "rdf-js";
import {createStream, QualifiedAttribute, QualifiedTag, SAXStream} from "sax";
import {Transform, TransformCallback} from "stream";

export class RdfXmlParser extends Transform {

  public static readonly RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
  public static readonly XML = 'http://www.w3.org/XML/1998/namespace';

  private readonly dataFactory: RDF.DataFactory;
  private readonly baseIRI: string;
  private readonly saxStream: SAXStream;

  private readonly activeTagStack: IActiveTag[] = [];
  private readonly nodeIds: {[id: string]: boolean} = {};

  constructor(args?: IRdfXmlParserArgs) {
    super({ objectMode: true });

    if (args) {
      Object.assign(this, args);
    }
    if (!this.dataFactory) {
      this.dataFactory = require('@rdfjs/data-model');
    }
    if (!this.baseIRI) {
      this.baseIRI = '';
    }

    this.saxStream = createStream(true, { xmlns: true });
    this.attachSaxListeners();
  }

  public valueToUri(value: string, activeTag: IActiveTag): RDF.NamedNode {
    return this.dataFactory.namedNode(!activeTag.baseIRI || value.indexOf('://') > 0
      ? value : activeTag.baseIRI + value);
  }

  public _transform(chunk: any, encoding: string, callback: TransformCallback) {
    this.saxStream.write(chunk, encoding);
    callback();
  }

  protected attachSaxListeners() {
    // Forward errors
    this.saxStream.on('error', (error) => this.emit('error', error));

    this.saxStream.on('opentag', (tag: QualifiedTag) => {
      // Get parent tag
      const parentTag: IActiveTag = this.activeTagStack.length
        ? this.activeTagStack[this.activeTagStack.length - 1] : null;
      let currentParseType = ParseType.RESOURCE;
      if (parentTag) {
        parentTag.hadChildren = true;
        currentParseType = parentTag.childrenParseType;
      }

      const activeTag: IActiveTag = {};
      if (parentTag) {
        // Inherit language scope and baseIRI from parent
        activeTag.language = parentTag.language;
        activeTag.baseIRI = parentTag.baseIRI;
      } else {
        activeTag.baseIRI = this.baseIRI;
      }
      this.activeTagStack.push(activeTag);
      if (currentParseType === ParseType.RESOURCE) {
        activeTag.childrenParseType = ParseType.PROPERTY;
        // Assume that the current node is a _typed_ node (2.13), unless we find an rdf:Description as node name
        let typedNode: boolean = true;

        if (tag.uri === RdfXmlParser.RDF) {
          switch (tag.local) {
          case 'RDF':
            // Tags under <rdf:RDF> must always be resources
            activeTag.childrenParseType = ParseType.RESOURCE;
          case 'Description':
            typedNode = false;
          }
        }

        const predicates: RDF.Term[] = [];
        const objects: RDF.Term[] = [];

        // Collect all attributes as triples
        for (const attributeKey in tag.attributes) {
          const attributeValue: QualifiedAttribute = tag.attributes[attributeKey];
          if (parentTag && attributeValue.uri === RdfXmlParser.RDF) {
            switch (attributeValue.local) {
            case 'about':
              if (activeTag.subject) {
                this.emit('error', new Error(`Only one of rdf:about, rdf:nodeID and rdf:ID can be present, \
while ${attributeValue.value} and ${activeTag.subject.value} where found.`));
              }
              activeTag.subject = this.valueToUri(attributeValue.value, activeTag);
              continue;
            case 'ID':
              if (activeTag.subject) {
                this.emit('error', new Error(`Only one of rdf:about, rdf:nodeID and rdf:ID can be present, \
while ${attributeValue.value} and ${activeTag.subject.value} where found.`));
              }
              if (this.nodeIds[attributeValue.value]) {
                this.emit('error', new Error(`Found multiple occurences of rdf:ID='${attributeValue.value}'.`));
              }
              this.nodeIds[attributeValue.value] = true;
              activeTag.subject = this.valueToUri('#' + attributeValue.value, activeTag);
              continue;
            case 'nodeID':
              if (activeTag.subject) {
                this.emit('error', new Error(`Only one of rdf:about, rdf:nodeID and rdf:ID can be present, \
while ${attributeValue.value} and ${activeTag.subject.value} where found.`));
              }
              activeTag.subject = this.dataFactory.blankNode(attributeValue.value);
              continue;
            }
          } else if (attributeValue.uri === RdfXmlParser.XML) {
            if (attributeValue.local === 'lang') {
              activeTag.language = attributeValue.value === '' ? null : attributeValue.value.toLowerCase();
              continue;
            } else if (attributeValue.local === 'base') {
              activeTag.baseIRI = attributeValue.value;
              continue;
            }
          }

          predicates.push(this.dataFactory.namedNode(attributeValue.uri + attributeValue.local));
          objects.push(this.dataFactory.literal(attributeValue.value));
        }

        // Skip further handling on root tag
        if (parentTag) {
          // Force the creation of a subject if it doesn't exist yet
          if (!activeTag.subject) {
            activeTag.subject = this.dataFactory.blankNode();
          }

          // Emit the type if we're at a typed node
          if (typedNode) {
            const type: RDF.NamedNode = this.dataFactory.namedNode(tag.uri + tag.local);
            this.push(this.dataFactory.triple(activeTag.subject,
              this.dataFactory.namedNode(RdfXmlParser.RDF + 'type'), type));
          }

          // If the parent tag defined a predicate, add the current tag as property value
          if (parentTag.predicate) {
            this.push(this.dataFactory.triple(parentTag.subject, parentTag.predicate, activeTag.subject));
          }

          // Emit all collected triples
          for (let i = 0; i < predicates.length; i++) {
            this.push(this.dataFactory.triple(activeTag.subject, predicates[i], objects[i]));
          }
        }
      } else { // currentParseType === ParseType.PROPERTY
        activeTag.childrenParseType = ParseType.RESOURCE;
        activeTag.subject = parentTag.subject; // Inherit parent subject
        if (tag.uri === RdfXmlParser.RDF && tag.local === 'li') {
          // Convert rdf:li to rdf:_x
          if (!parentTag.listItemCounter) {
            parentTag.listItemCounter = 1;
          }
          activeTag.predicate = this.dataFactory.namedNode(tag.uri + '_' + parentTag.listItemCounter++);
        } else {
          activeTag.predicate = this.dataFactory.namedNode(tag.uri + tag.local);
        }
        let parseTypeResource: boolean = false;
        let attributedProperty: boolean = false;
        for (const propertyAttributeKey in tag.attributes) {
          const propertyAttributeValue: QualifiedAttribute = tag.attributes[propertyAttributeKey];
          if (propertyAttributeValue.uri === RdfXmlParser.RDF) {
            switch (propertyAttributeValue.local) {
            case 'resource':
              if (attributedProperty) {
                this.emit('error', new Error(
                  `Found both non-rdf:* property attributes and rdf:resource (${propertyAttributeValue.value}).`));
              }
              if (activeTag.nodeId) {
                this.emit('error', new Error(`Found both rdf:resource (${propertyAttributeValue.value
                  }) and rdf:nodeID (${activeTag.nodeId.value}).`));
              }
              if (parseTypeResource) {
                this.emit('error',
                  new Error(`rdf:parseType="Resource" is not allowed on property elements with rdf:resource (${
                    propertyAttributeValue.value})`));
              }
              activeTag.hadChildren = true;
              this.push(this.dataFactory.triple(activeTag.subject, activeTag.predicate,
                this.valueToUri(propertyAttributeValue.value, activeTag)));
              continue;
            case 'datatype':
              if (attributedProperty) {
                this.emit('error', new Error(
                  `Found both non-rdf:* property attributes and rdf:datatype (${propertyAttributeValue.value}).`));
              }
              if (parseTypeResource) {
                this.emit('error',
                  new Error(`rdf:parseType="Resource" is not allowed on property elements with rdf:datatype (${
                    propertyAttributeValue.value})`));
              }
              activeTag.datatype = this.valueToUri(propertyAttributeValue.value, activeTag);
              continue;
            case 'nodeID':
              if (attributedProperty) {
                this.emit('error', new Error(
                  `Found both non-rdf:* property attributes and rdf:nodeID (${propertyAttributeValue.value}).`));
              }
              if (activeTag.hadChildren) {
                this.emit('error', new Error(
                  `Found both rdf:resource and rdf:nodeID (${propertyAttributeValue.value}).`));
              }
              if (parseTypeResource) {
                this.emit('error',
                  new Error(`rdf:parseType="Resource" is not allowed on property elements with rdf:nodeID (${
                    propertyAttributeValue.value})`));
              }
              activeTag.nodeId = this.dataFactory.blankNode(propertyAttributeValue.value);
              continue;
            case 'parseType':
              if (propertyAttributeValue.value === 'Resource') {
                parseTypeResource = true;
                activeTag.childrenParseType = ParseType.PROPERTY;

                // Validation
                if (attributedProperty) {
                  this.emit('error', new Error(
                    `rdf:parseType="Resource" is not allowed when non-rdf:* property attributes are present`));
                }
                if (activeTag.hadChildren) {
                  this.emit('error',
                    new Error(`rdf:parseType="Resource" is not allowed on property elements with rdf:resource`));
                }
                if (activeTag.datatype) {
                  this.emit('error',
                    new Error(`rdf:parseType="Resource" is not allowed on property elements with rdf:datatype (${
                      activeTag.datatype.value})`));
                }
                if (activeTag.nodeId) {
                  this.emit('error',
                    new Error(`rdf:parseType="Resource" is not allowed on property elements with rdf:nodeID (${
                      activeTag.nodeId.value})`));
                }

                // Turn this property element into a node element
                const nestedBNode: RDF.BlankNode = this.dataFactory.blankNode();
                this.push(this.dataFactory.triple(activeTag.subject, activeTag.predicate, nestedBNode));
                activeTag.subject = nestedBNode;
                activeTag.predicate = null;
              }
              continue;
            }
          } else if (propertyAttributeValue.uri === RdfXmlParser.XML && propertyAttributeValue.local === 'lang') {
            activeTag.language = propertyAttributeValue.value === ''
              ? null : propertyAttributeValue.value.toLowerCase();
            continue;
          }

          // Interpret attributes at this point as properties via implicit blank nodes on the property
          if (parseTypeResource || activeTag.hadChildren || activeTag.datatype || activeTag.nodeId) {
            this.emit('error', new Error(
              `Found illegal rdf:* properties on property element with attribute: ${propertyAttributeValue.value}`));
          }
          activeTag.hadChildren = true;
          attributedProperty = true;
          const implicitPropertyBNode: RDF.BlankNode = this.dataFactory.blankNode();
          this.push(this.dataFactory.triple(activeTag.subject, activeTag.predicate, implicitPropertyBNode));
          this.push(this.dataFactory.triple(
            implicitPropertyBNode,
            this.dataFactory.namedNode(propertyAttributeValue.uri + propertyAttributeValue.local),
            this.dataFactory.literal(propertyAttributeValue.value,
              activeTag.datatype || activeTag.language),
          ));
        }
      }
    });

    this.saxStream.on('text', (text: string) => {
      const activeTag: IActiveTag = this.activeTagStack.length
        ? this.activeTagStack[this.activeTagStack.length - 1] : null;

      if (activeTag && activeTag.predicate) {
        activeTag.text = text;
      }
    });

    this.saxStream.on('closetag', (tagName: string) => {
      const poppedTag: IActiveTag = this.activeTagStack.pop();
      if (poppedTag && !poppedTag.hadChildren && poppedTag.predicate) {
        if (poppedTag.text) {
          // Property element contains text
          this.push(this.dataFactory.triple(poppedTag.subject, poppedTag.predicate,
            this.dataFactory.literal(poppedTag.text, poppedTag.datatype || poppedTag.language)));
        } else {
          // Property element is a blank node
          this.push(this.dataFactory.triple(poppedTag.subject, poppedTag.predicate,
            poppedTag.nodeId || this.dataFactory.blankNode()));
        }
      }
    });
  }
}

export interface IRdfXmlParserArgs {
  dataFactory?: RDF.DataFactory;
  baseIRI?: string;
}

export interface IActiveTag {
  subject?: RDF.Term;
  predicate?: RDF.Term;
  hadChildren?: boolean;
  text?: string;
  language?: string;
  datatype?: RDF.NamedNode;
  nodeId?: RDF.BlankNode;
  childrenParseType?: ParseType;
  baseIRI?: string;
  listItemCounter?: number;
}

export enum ParseType {
  RESOURCE,
  PROPERTY,
}
