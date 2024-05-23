export class QuizManager{
    private quizes: Quiz[]

    constructor(){
        this.quizes = []
    }

    public start(roomId: string){
        const io = IoManager.getIo();
        const quiz = this.quizes.find(quiz => quiz.roomId === roomId);
        if(!quiz){
            console.error('Quiz not found');
            return;
        }
        quiz?.start();

    }

    addProblem(roomId: string, problem: Problem){
        let quiz = this.getQuiz(roomId);
        if(!quiz){
            return;
        }
    }

    addUser(roomId: string, name: string){
        this.getQuiz(roomId)?.addUser(name);
    }

    submit(roomId: string, userId: string, problemId: string, submission: number){
        this.getQuiz(roomId)?.submit(userId, problemId, submission);
    }

    public next(){

    }

    getQuiz(roomId: string){
        return this.quizes.find(quiz => quiz.roomId === roomId) ?? null;
    }

    getCurrentState(): {
        type: "LEADEERBOARD",
        leaderboard: any,


    } | {
        type: "PROBLEM",
        problem: any
    } | {
        type: "QUIZ_END"
    }{
        return {
            type: "LEADERBOARD",
            leaderboard: []
        }
    } {
        return {
            type: "PROBLEM",
            problem: {}
        }
    }{
        return {
            type: "QUIZ_END"
        }
    }

}