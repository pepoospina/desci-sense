export enum PLATFORM {
  X = 'X',
  Nanopubs = 'Nanopubs'
}

export interface PostCreate {
  content: string;
  platforms: [PLATFORM]
}