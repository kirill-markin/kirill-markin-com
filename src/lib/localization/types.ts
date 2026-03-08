import { Language } from './languages';

export type LocalizedTextMap = Record<Language, string>;

export type PathSegmentsMap = Record<string, LocalizedTextMap>;

export type SubPathSegmentsMap = Record<string, Record<string, LocalizedTextMap>>;
