import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json"
import { Quiz } from '../../interfaces/quiz';
import { Question } from '../../interfaces/question';

@Component({
	selector: 'app-quizz',
	imports: [CommonModule],
	templateUrl: './quizz.component.html',
	styleUrl: './quizz.component.css',
})
export class QuizzComponent {
	quizData: Quiz = quizz_questions;

	title: string = this.quizData.title;
	questions: Question[] = this.shuffleArray([...this.quizData.questions]);
	currentQuestionIndex: number = 0;
	questionSelected: Question = this.questions[this.currentQuestionIndex];
	answers: number[] = [];
	finished: boolean = false;
	answerSelected: string = '';
	characterDescription: string = '';
	characterImage: string = '';
	resultCharacter: string = '';
	winningType: string = "";
	anime: string = "";

	private shuffleArray<T>(array: T[]): T[] {
			const shuffled = [...array];
			for (let i = shuffled.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			return shuffled;
	}

	playerChoice(alias: string): void {
			this.answers.push(this.questionSelected.options.findIndex(opt => opt.alias === alias) + 1);

			if (this.currentQuestionIndex < this.questions.length - 1) {
					this.currentQuestionIndex++;
					this.questionSelected = this.questions[this.currentQuestionIndex];
			} else {
					this.finished = true;
					this.calculateResult();
			}
	}

	getShuffledOptions(): { id: number; name: string; alias: string }[] {
			return this.shuffleArray([...this.questionSelected.options]);
	}

	private calculateResult(): void {
			const mbtiScores: { [key: string]: number } = {
					INTJ: 0, INTP: 0, ENTJ: 0, ENTP: 0,
					INFJ: 0, INFP: 0, ENFJ: 0, ENFP: 0,
					ISTJ: 0, ISFJ: 0, ESTJ: 0, ESFJ: 0,
					ISTP: 0, ISFP: 0, ESTP: 0, ESFP: 0
			};

			for (let i = 0; i < 11; i++) {
					const question = this.questions[i];
					const answerId = this.answers[i];
					const option = question.options.find(opt => opt.id === answerId);
					if (option) {
							const types = option.alias.split(", ");
							types.forEach(type => mbtiScores[type]++);
					}
			}

			let maxScore = 0;
			for (const [type, score] of Object.entries(mbtiScores)) {
					if (score > maxScore) {
							maxScore = score;
							this.winningType = type;
					}
			}

			const possibleCharacters = this.quizData.result.filter(
					(item: { character: string; type: string }) => item.type ===this.winningType
			);

			const firstName = possibleCharacters[0].character.split(" ")[0];
			const secondName = possibleCharacters[1].character.split(" ")[0];
			let firstScore = 0;
			let secondScore = 0;

			for (let i = 11; i < 14; i++) {
					const question = this.questions[i];
					const answerId = this.answers[i];
					const option = question.options.find(opt => opt.id === answerId);
					if (option) {
							const names = option.alias.split(", ");
							if (names.includes(firstName)) firstScore++;
							if (names.includes(secondName)) secondScore++;
					}
			}

			this.resultCharacter = firstScore >= secondScore ? possibleCharacters[0].character : possibleCharacters[1].character;

			const characterData = this.quizData.result.find(
					(item: { character: string; type: string; anime: string; description: string; img: string }) =>
							item.character === this.resultCharacter && item.type === this.winningType
			);

			this.anime = characterData ? characterData.anime : "Anime não encontrado";
			this.answerSelected = `Seu tipo é ${this.winningType}, você é: ${this.resultCharacter} do anime ${this.anime}!`;
			this.characterDescription = characterData ? characterData.description : "Descrição não encontrada";
			this.characterImage = characterData ? characterData.img : "";
	}


	restartQuiz(): void {
			this.questions = this.shuffleArray([...this.quizData.questions]);
			this.currentQuestionIndex = 0;
			this.questionSelected = this.questions[this.currentQuestionIndex];
			this.answers = [];
			this.finished = false;
			this.answerSelected = '';
			this.characterDescription = '';
			this.characterImage = '';
			this.resultCharacter = '';
	}
}
