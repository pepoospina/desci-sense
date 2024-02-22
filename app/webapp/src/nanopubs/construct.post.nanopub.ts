import init, { Nanopub } from '@nanopub/sign';
import { DataFactory, NamedNode, Quad_Subject, Store } from 'n3';

import { THIS_POST_NAME } from '../app/config';
import {
  forEachStore,
  parseRDF,
  replaceNode,
  writeRDF,
} from '../shared/n3.utils';
import { AppPostSemantics } from '../shared/parser.types';
import { AppUserRead } from '../shared/types';
import {
  ASSERTION_GRAPH,
  COSMO_SCHEMA,
  HAS_COMMENT_URI,
  IS_A,
  NANOPUB_PLACEHOLDER,
  ORCID_URL,
} from './semantics.helper';

const { literal, namedNode, defaultGraph } = DataFactory;

export const constructPostNanopub = async (
  content: string,
  user: AppUserRead,
  semantics?: AppPostSemantics
): Promise<Nanopub> => {
  await (init as any)();
  const orcid = user.orcid?.orcid;
  const address = user.eth?.ethAddress;

  let assertionsStore0 = semantics ? await parseRDF(semantics) : undefined;
  let assertionsStore = new Store();

  /** add the parser semantics in the :assertion nanopub subgraph */
  if (assertionsStore0) {
    forEachStore(assertionsStore0, (quad) => {
      const subject = replaceNode(quad.subject as NamedNode, {
        [THIS_POST_NAME]: ASSERTION_GRAPH,
      }) as Quad_Subject;

      assertionsStore.addQuad(
        subject,
        quad.predicate,
        quad.object,
        defaultGraph()
      );
    });
  }

  /** add the post content as an assertion */
  assertionsStore.addQuad(
    namedNode(ASSERTION_GRAPH),
    namedNode(HAS_COMMENT_URI),
    literal(content),
    defaultGraph()
  );

  /** parse the assertions triplets */
  const assertionsRdf = await writeRDF(assertionsStore);

  /** Provenance */
  const provStore = new Store();
  /** signed by ethaddress */
  provStore.addQuad(
    namedNode(NANOPUB_PLACEHOLDER),
    namedNode(`${COSMO_SCHEMA}SignedBy`),
    namedNode(`https://etherscan.io/address/${address}`),
    defaultGraph()
  );

  provStore.addQuad(
    namedNode(ASSERTION_GRAPH),
    namedNode(`http://www.w3.org/ns/prov#wasAttributedTo`),
    namedNode(`${ORCID_URL}${orcid}`),
    defaultGraph()
  );

  const provRdf = await writeRDF(provStore);

  /** Pubinfo */
  const pubInfoStore = new Store();

  /** Activity */
  pubInfoStore.addQuad(
    namedNode(`${NANOPUB_PLACEHOLDER}#activity`),
    namedNode(IS_A),
    namedNode(`${COSMO_SCHEMA}nlpFacilitatedActivity`),
    defaultGraph()
  );

  /** attributed to */
  pubInfoStore.addQuad(
    namedNode(ASSERTION_GRAPH),
    namedNode('http://www.w3.org/ns/prov#wasAttributedTo'),
    namedNode(`${ORCID_URL}${orcid}`),
    defaultGraph()
  );

  /** example np  */
  pubInfoStore.addQuad(
    namedNode(NANOPUB_PLACEHOLDER),
    namedNode(IS_A),
    namedNode('http://purl.org/nanopub/x/ExampleNanopub'),
    defaultGraph()
  );

  const pubinfoRdf = await writeRDF(pubInfoStore);

  const rdfStr = `
    @prefix : <${NANOPUB_PLACEHOLDER}#> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix dc: <http://purl.org/dc/terms/> .
    @prefix pav: <http://purl.org/pav/> .
    @prefix prov: <http://www.w3.org/ns/prov#> .
    @prefix np: <http://www.nanopub.org/nschema#> .
    @prefix npx: <http://purl.org/nanopub/x/> .
    @prefix ex: <http://example.org/> .
    @prefix cosmo: <https://orcid.org/> .

    :Head {
      : np:hasAssertion :assertion ;
        np:hasProvenance :provenance ;
        np:hasPublicationInfo :pubinfo ;
        a np:Nanopublication ;
        a cosmo:SemanticPost .
    }

    :assertion {
      ${assertionsRdf}
    }

    :provenance {
      ${provRdf}
    }

    :pubinfo {
      : a npx:ExampleNanopub .
      ${pubinfoRdf}
    }
  `;

  const np = new Nanopub(rdfStr);
  return np;
};
