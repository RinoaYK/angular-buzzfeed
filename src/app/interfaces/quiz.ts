import { Question } from "./question";

export interface Quiz {
	title: string;
	questions: Question[];
	result: { character: string; type: string; anime: string; description: string; img: string }[];
}
