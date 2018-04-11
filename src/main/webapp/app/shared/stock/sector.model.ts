export class Sector {
    constructor(
        public id: number,
        public name: string,
        public stockUp: number,
        public stockDown: number,
        public totalArticles: number
    ) { }
}

export class Stock {
    constructor(
        public id: number,
        public name: string,
        public stockUp: number,
        public stockDown: number,
        public totalArticles: number
    ) { }
}
