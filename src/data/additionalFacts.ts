export interface AdditionalFactLink {
  name: string;
  url?: string;
}

export interface WebsiteFactLink extends AdditionalFactLink {
  url: string;
}

export interface MembershipFactLink extends WebsiteFactLink {
  roleName: string;
  startDate: string;
}

export type AdditionalFact =
  | { kind: 'founder'; links: WebsiteFactLink[] }
  | { kind: 'sibling'; links: WebsiteFactLink[] }
  | { kind: 'alumni'; links: AdditionalFactLink[] }
  | { kind: 'jury'; links: MembershipFactLink[] }
  | { kind: 'judge'; links: MembershipFactLink[] };

export type AdditionalFactKind = AdditionalFact['kind'];

export const additionalFacts: AdditionalFact[] = [
  {
    kind: 'founder',
    links: [{ name: 'Nibomo', url: 'https://nibomo.com/' }],
  },
  {
    kind: 'sibling',
    links: [{ name: 'Katerina Markina', url: 'https://www.markinakv.com/' }],
  },
  {
    kind: 'sibling',
    links: [{ name: 'Andrey Markin', url: 'https://andrey-markin.com/' }],
  },
  {
    kind: 'sibling',
    links: [{ name: 'Alex Markin', url: 'https://alex-markin.com/' }],
  },
  {
    kind: 'jury',
    links: [
      {
        name: 'Global Startup Awards Africa',
        url: 'https://www.globalstartupawardsafrica.com/gsa-jury-2024',
        roleName: 'Jury',
        startDate: '2024',
      },
    ],
  },
  {
    kind: 'judge',
    links: [
      {
        name: 'Founder Institute',
        url: 'https://fi.co/',
        roleName: 'Mentor and Judge',
        startDate: '2024-04',
      },
      {
        name: 'MassChallenge',
        url: 'https://www.masschallenge.org/',
        roleName: 'Judge',
        startDate: '2024-03',
      },
    ],
  },
  {
    kind: 'alumni',
    links: [{ name: 'Bauman Moscow State Technical University' }],
  },
];

const LINKS_PLACEHOLDER = '{links}';

/**
 * Splits a localized fact template around its single `{links}` placeholder
 * and inserts the rendered links joined by the localized conjunction.
 */
export function fillAdditionalFactTemplate<T>(
  template: string,
  renderedLinks: T[],
  conjunction: string
): (string | T)[] {
  const parts = template.split(LINKS_PLACEHOLDER);
  if (parts.length !== 2) {
    throw new Error(`Additional fact template must contain ${LINKS_PLACEHOLDER} exactly once: "${template}"`);
  }

  const joinedLinks = renderedLinks.flatMap((link, index) =>
    index === 0 ? [link] : [` ${conjunction} `, link]
  );

  return [parts[0], ...joinedLinks, parts[1]];
}
