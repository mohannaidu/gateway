import { BaseEntity } from './../../shared';

export class Sector implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public infos?: BaseEntity[],
    ) {
    }
}
export class Stock implements BaseEntity {
    constructor(
        public id?: number,
        public opening?: number,
        public closing?: number,
        public info?: BaseEntity[],
    ) {
    }
}
export class LatestNews implements BaseEntity {
    constructor(
        public author?: string,
        public content?: string,
        public description?: string,
        public docid?: string,
        public id?: string,
        public status?: number,
        public type?: string,
        public title?: string,
        public publishdate?: string,
        public url?: string,
    ) {
    }
}
