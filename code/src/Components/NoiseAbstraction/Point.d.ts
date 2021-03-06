export default Point;
declare class Point {
	x: number;
	y: number;
	constructor(x?: number, y?: number);
	static create(o: any, a: any): any;
	static add(p1: any, p2: any): any;
	static subtract(p1: any, p2: any): any;
	static scale(p: any, scaleX: any, scaleY: any): any;
	static equals(p1: any, p2: any): any;
	static angle(p: any): any;
	static distance(p1: any, p2: any): any;
	static dot(p1: any, p2: any): any;
	static cross(p1: any, p2: any): any;
	static interpolate(p1: any, p2: any, f: any): any;
	static polar(length: any, radian: any): any;
	add(p: any): any;
	subtract(p: any): any;
	scale(scaleX: any, scaleY: any): any;
	equals(p: any): any;
	angle(): any;
	distance(p: any): any;
	length(): any;
	set(p: Point): any;
	set(x: any, y: any): any;
	offset(p: Point): any;
	offset(x: any, y: any): any;
	normalize(thickness: any): any;
	negate(): any;
	perp(): any;
	clone(): any;
	toArray(): any;
	toString(): any;
}
