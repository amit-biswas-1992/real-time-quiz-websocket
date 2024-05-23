import { IoManager } from "./managers/IoManager";

interface Problem{
    id: string;
    title: string;
    description: string;
    image: string;
    answer: AllowedSubmissions;
    option:{
        id: number;
        title: string;
    },
    submissions: Submission[]
}

interface Submission{
    userId: string;
    problemId: string;
    submission: string;
    isCorrect: boolean;
    optionSelected: string;

}

export type AllowedSubmissions =  0 | 1 | 2 | 3 | 4 ;
const PROBLEM_TIME_S = 20;

interface User{
    id: string;
    name: string;
}

export class Quiz{
    private roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState: "LEADERBOARD" | "QUESTION" | "NOT_STARTED" | "FINISHED";


    constructor(roomId: string){
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
    }

    addProblem(problem: Problem){
        this.problems.push(problem);
    }

    start(){
        this.hasStarted = true;
        const io = IoManager.getIo();
        io.emit('CHANGE_PROBLEM', {
            problem: this.problems[0]
        });
    }

    setActiveProblem(problem: Problem){
        problem.startTime = new Date.getTime();
        problem.submissions = [];
        setTimeout(() => {
            this.sendLeaderboard();
        }
    }


    sendLeaderboard(){
        const leaderboard = this.getLeaderboard().splice(0, 20);
        IoManager.getIo().to(this.roomId).emit('LEADERBOARD', leaderboard);
       
    }

    next(){
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];

        if(problem){
            this.setActiveProblem(problem);
        }
        else{
            //quiz complete and emit quiz end
        }
    }

    addUser(name: string){
        const id = this.getRandomString(7);
        this.users.push({
            id,
            name
        })

    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmissions){
        const problem = this.problems.find(problem => problem.id === problemId);
        
        if(!problem || !user){
            return;
        }
        const existingSubmission = problem.submissions.find(submission => submission.userId === userId );
        if(existingSubmission){
            return;
        }

        problem.submissions.push({
            userId,
            problemId,
            isCorrect: submission === problem.answer,
            optionSelected: submission
        });
            
        
    }

    getRandomString(length: number){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    getLeaderboard(){
        return this.users.sort ((a, b) => { a.points < b.points ? 1 : -1 });
    }

    getCurrentState(){
        if(this.currentState === "NOT_STARTED"){
            return {
                type: "NOT_STARTED",
                
            }
        }

        if(this.currentState === "LEADERBOARD"){
            return {
                type: "LEADERBOARD",
                leaderboard: this.getLeaderboard()
            }
        }

        if(this.currentState === "QUESTION"){

            return {
                type: "QUESTION",
                problem: this.problems[this.activeProblem]
            }
        }
    }

}