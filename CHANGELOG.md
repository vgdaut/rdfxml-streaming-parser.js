# Changelog
All notable changes to this project will be documented in this file.

<a name="v2.0.0"></a>
## [v2.0.0](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.5.0...v2.0.0) - 2022-07-14

This release has been marked as a major change due to the transition from Node's internal `stream` API to `readable-stream`.
Most users should experience not breakages with this change.

### Changed
* [Uses native saxes namespace support](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/0989939c936f5cc353a4dd3e43301dfbbc35308c)
* [Move away from Node.js built-ins](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/0afa4eaf9ff879a55e27e553d5d9d41f1ddbf6e2)
* [Enable tree shaking in package.json](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/b98fd369d2eba026d6ec816e75ec7b5e85cc58af)

<a name="v1.5.0"></a>
## [v1.5.0](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.4.0...v1.5.0) - 2021-08-11

### Changed
* [Migrate to @rdfjs/types](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/7d4c747ce1585a58ebbeb7fb723bc30fda8aaa63)

<a name="v1.4.0"></a>
## [v1.4.0](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.3.6...v1.4.0) - 2020-09-15

### Changed
* [Update to @types/rdf-js 4.x](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/f1a2b8a874dcfbed02e475964eacd375dd817e59)

### Fixed
* [Fix import method sometimes failing on large streams](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/9eaead0ba1c1b72fd3b0f61d25bef0c1d19577b8)

<a name="v1.3.6"></a>
## [v1.3.6](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.3.5...v1.3.6) - 2020-06-03

### Fixed
* [Fix incompatibility with WhatWG streams, Closes #35](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/93f21e91a3321407dcc65007d32f10569e2496d4)

### Changed
* [Update dependency @types/rdf-js to v3 (#33)](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/35509c1fad2005a0c63e062fb62c1bed47e2d3ce)

<a name="v1.3.5"></a>
## [v1.3.5](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.3.4...v1.3.5) - 2020-04-14

### Fixed
* [Fix relative xml:base not being handled, Closes #32](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/a50f49d8eb8ecae4e216a535c0b8b9f4fb0ff655)

<a name="v1.3.4"></a>
## [v1.3.4](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.3.3...v1.3.4) - 2020-01-27

### Changed
* [Make implementation more strongly typed on RDF terms](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/97cadae46da140cf273f92e483d338ae50074291)

<a name="v1.3.3"></a>
## [v1.3.3](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.3.2...v1.3.3) - 2020-01-17

### Fixed
* [Implement RDF.Sink interface in TypeScript](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/6a78effbad97abdfe3833151a624dbf7d65e964a)

<a name="v1.3.2"></a>
## [v1.3.2](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.3.1...v1.3.2) - 2020-01-12

### Fixed
* [Fix xmlns in datatyped property tags causing errors, Closes #21](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/6913fa1ffea102ba9c35743fc769961cc47d816f)

<a name="v1.3.1"></a>
## [v1.3.1](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.3.0...v1.3.1) - 2019-07-17

### Fixed
* [Fix doctype parser not accepting single-quoted strings](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/d6b23309f77027bd7405ea9d3ae9e066e366e1a8)

<a name="v1.3.0"></a>
## [v1.3.0](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.2.4...v1.3.0) - 2019-07-03

### Added
* [Add 'trackPosition' option to print line numbers on errors, Closes #16](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/1a948ffa72a70503022d4a31c0c6ecd7d5ba7e12)
* [Add 'allowDuplicateRdfIds' to allow duplicate rdf:IDs, Closes #18](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/1195847f1ee419d67d217bffaadc51a2d5f91f72)

### Fixed
* [Make DOCTYPE ENTITY parsing less strict regarding whitespace characters](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/76a641366d97f5db53ea80da025018fb5ff60f05)

<a name="v1.2.4"></a>
## [v1.2.4](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.2.3...v1.2.4) - 2019-06-24

### Fixed
* [Fix _: being accepted as valid IRIs, Closes #15](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/838bfe8834bca20d60297f79f0aa8ced981d111f)

<a name="v1.2.3"></a>
## [v1.2.3](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.2.2...v1.2.3) - 2019-04-25

### Fixed
* [Fix stream transformation continuing after first error, #12](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/acc805b1b963067eae8e7583bc6debe4ec198e3e)

<a name="v1.2.2"></a>
## [v1.2.2](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.2.1...v1.2.2) - 2019-04-25

### Fixed
* [Error on unbound prefixes, Closes #12](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/0931aab22c505cbfdd7ae89fd7fd5065a1cb3555)
* [Validate all created URIs, Closes #11](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/75588df39b49d6945001d381af76d38ba9add768)

<a name="v1.2.1"></a>
## [v1.2.1](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.2.0...v1.2.1) - 2019-04-02

### Fixed
* [Fix doctype entities not being considered in base IRIs, Closes #10](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/3cda7e18839200e1130af06de23128dd56f24e41)

<a name="v1.2.0"></a>
## [v1.2.0](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.1.0...v1.2.0) - 2019-01-28

### Added
* [Implement #import method](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/9213f6c1b634df839ea970a2f308506bcaa9b4fa)

<a name="v1.1.0"></a>
## [v1.1.0](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.0.1...v1.1.0) - 2018-11-08

### Changed
* [Update to generic RDFJS typings](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/f6558c57b5a2de83e775fe82f4e97f576d6a78c7)
* [Depend on relative-to-absolute-iri for IRI resolving](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/8fb6beb72d159be7b1a86b62701dc8274be9619e)

<a name="v1.0.1"></a>
## [v1.0.1](https://github.com/rdfjs/rdfxml-streaming-parser.js/compare/v1.0.0...v1.0.1) - 2018-10-09

### Fixed
* [Throw an error on li attributes on node elements](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/affb69bafb7f6ccfa72be731a7058314a541e2b4)
* [Throw errors on rdf:aboutEach and rdf:aboutEachPrefix](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/d981af760f5b4a21d73d325f4105da203bd8223c)
* [Add stricter NCName validation](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/25d97be70d88e18aed856c9aae15741cc9300c5e)
* [Make parseType and resource interactions more strict](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/25e397285db03e8094197515394ee62f88f29761)
* [Add blacklists for forbidden node and property element names](https://github.com/rdfjs/rdfxml-streaming-parser.js/commit/1e812fcbaef4bb4ad112f3eec83e3ce91bc97d51)

<a name="1.0.0"></a>
## [1.0.0] - 2018-09-04
* Initial release
