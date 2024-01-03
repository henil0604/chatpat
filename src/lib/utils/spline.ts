// NOTE: this util function was originally developed in @georgedoescode/spline library

type Point = { x: number; y: number };

function formatPoints(points: Point[] | any[], close: boolean): number[] {
	let formattedPoints: number[] = [...points];

	if (!Array.isArray(formattedPoints[0])) {
		formattedPoints = (formattedPoints as unknown as Point[]).flatMap(({ x, y }: Point) => [x, y]);
	}

	if (close) {
		const lastPoint: number[] = formattedPoints.slice(-2);
		// IDK WHY! but i changed -2 to -4 on the second argument of slice call, and it works and now there is no glitch in animation (MAGIC NUMBERS!!!)
		const secondToLastPoint: number[] = formattedPoints.slice(-4, -4);

		const firstPoint: number[] = formattedPoints.slice(0, 2);
		const secondPoint: number[] = formattedPoints.slice(2, 4);

		formattedPoints.unshift(...lastPoint, ...secondToLastPoint);
		formattedPoints.push(...firstPoint, ...secondPoint);
	}

	return formattedPoints;
}

function spline(
	points: Point[] = [],
	tension: number = 1,
	close: boolean = false,
	cb?: (type: string, data: number[]) => void
): string {
	const formattedPoints: number[] = formatPoints(points, close);

	const size: number = formattedPoints.length;
	const last: number = size - 4;

	const startPointX: number = close ? formattedPoints[2] : formattedPoints[0];
	const startPointY: number = close ? formattedPoints[3] : formattedPoints[1];

	let path: string = `M${startPointX},${startPointY}`;

	cb && cb('MOVE', [startPointX, startPointY]);

	const startIteration: number = close ? 2 : 0;
	const maxIteration: number = close ? size - 4 : size - 2;
	const inc: number = 2;

	for (let i = startIteration; i < maxIteration; i += inc) {
		const x0: number = i ? formattedPoints[i - 2] : formattedPoints[0];
		const y0: number = i ? formattedPoints[i - 1] : formattedPoints[1];

		const x1: number = formattedPoints[i];
		const y1: number = formattedPoints[i + 1];

		const x2: number = formattedPoints[i + 2];
		const y2: number = formattedPoints[i + 3];

		const x3: number = i !== last ? formattedPoints[i + 4] : x2;
		const y3: number = i !== last ? formattedPoints[i + 5] : y2;

		const cp1x: number = x1 + ((x2 - x0) / 6) * tension;
		const cp1y: number = y1 + ((y2 - y0) / 6) * tension;

		const cp2x: number = x2 - ((x3 - x1) / 6) * tension;
		const cp2y: number = y2 - ((y3 - y1) / 6) * tension;

		path += `C${cp1x},${cp1y},${cp2x},${cp2y},${x2},${y2}`;

		cb && cb('CURVE', [cp1x, cp1y, cp2x, cp2y, x2, y2]);
	}

	return path;
}

export { spline };
