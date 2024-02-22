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
  HEAD_GRAPH,
  IS_A,
  NANOPUB_PLACEHOLDER,
  NANOPUB_SCHEMA,
  ORCID_URL,
  PROVENANCE_GRAPH,
  PUBINFO_GRAPH,
} from './semantics.helper';

const { defaultGraph, literal, namedNode } = DataFactory;

export const constructPostNanopub = async (
  content: string,
  user: AppUserRead,
  semantics?: AppPostSemantics
): Promise<Nanopub> => {
  await (init as any)();
  const orcid = user.orcid?.orcid;
  const address = user.eth?.ethAddress;

  const npStore = new Store();
  const assertionsStore = semantics ? await parseRDF(semantics) : undefined;

  if (assertionsStore) {
    /** add the parser semantics in the :assertion nanopub subgraph */
    forEachStore(assertionsStore, (quad) => {
      const subject = replaceNode(quad.subject as NamedNode, {
        [THIS_POST_NAME]: ASSERTION_GRAPH,
      }) as Quad_Subject;

      npStore.addQuad(
        subject,
        quad.predicate,
        quad.object,
        namedNode(ASSERTION_GRAPH)
      );
    });
  }

  /** add the post content as an assertion */
  npStore.addQuad(
    namedNode(ASSERTION_GRAPH),
    namedNode(HAS_COMMENT_URI),
    literal(content),
    namedNode(ASSERTION_GRAPH)
  );

  /** mark as an example nanopub */
  npStore.addQuad(
    namedNode(NANOPUB_PLACEHOLDER),
    namedNode(IS_A),
    namedNode(`${NANOPUB_SCHEMA}ExampleNanopub`),
    namedNode(PUBINFO_GRAPH)
  );

  /** head */
  npStore.addQuad(
    namedNode(`${NANOPUB_PLACEHOLDER}#Head`),
    namedNode(`${NANOPUB_SCHEMA}hasAssertion`),
    namedNode(ASSERTION_GRAPH),
    defaultGraph()
  );

  npStore.addQuad(
    namedNode(`${NANOPUB_PLACEHOLDER}#Head`),
    namedNode(`${NANOPUB_SCHEMA}hasProvenance`),
    namedNode(PROVENANCE_GRAPH),
    defaultGraph()
  );

  npStore.addQuad(
    namedNode(NANOPUB_PLACEHOLDER),
    namedNode(`${NANOPUB_SCHEMA}hasPublicationInfo`),
    namedNode(PUBINFO_GRAPH),
    defaultGraph()
  );

  npStore.addQuad(
    namedNode(NANOPUB_PLACEHOLDER),
    namedNode(IS_A),
    namedNode(`${NANOPUB_SCHEMA}Nanopublication`),
    defaultGraph()
  );

  npStore.addQuad(
    namedNode(`${NANOPUB_PLACEHOLDER}#activity`),
    namedNode(IS_A),
    namedNode(`${COSMO_SCHEMA}nlpFacilitatedActivity`),
    namedNode(PROVENANCE_GRAPH)
  );

  npStore.addQuad(
    namedNode(ASSERTION_GRAPH),
    namedNode('http://www.w3.org/ns/prov#wasAttributedTo'),
    namedNode(`${ORCID_URL}${orcid}`),
    namedNode(PROVENANCE_GRAPH)
  );

  /** mark as an exmaple nanopub */
  npStore.addQuad(
    namedNode(NANOPUB_PLACEHOLDER),
    namedNode(IS_A),
    namedNode(`${COSMO_SCHEMA}SemanticPost`),
    namedNode(PUBINFO_GRAPH)
  );

  npStore.addQuad(
    namedNode(NANOPUB_PLACEHOLDER),
    namedNode(`${COSMO_SCHEMA}SignedBy`),
    namedNode(`https://etherscan.io/address/${address}`),
    namedNode(PUBINFO_GRAPH)
  );

  const rdfStr = await writeRDF(npStore);
  const np = new Nanopub(rdfStr);
  return np;
};
