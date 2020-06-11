export interface NpmsInterface {
  m: {
    name: string;
    version: string;
    description: string;
    license: string;
    date: string;
    links: {
      repository: string;
      homepage: string;
      npm: string;
    };
  };
  g: {
    issues: number;
    stars: number;
  };
  dl: number;
}

export interface NpmsErrorInterface {
  code: number;
  message: string;
}

export interface BpInterface {
  s: number;
  gz: number;
}
