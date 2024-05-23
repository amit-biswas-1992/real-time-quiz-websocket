import Socket from 'socket.io'
import { QuizManager } from './QuizManager';

const ADMIN_PASSWORD = 'ADMIN_PASSWORD';

export class UserManager{
    private users: {
        roomId: string,
        socket: Socket
    }[];

    private quizManager: QuizManager;


    constructor(){
        this.users = [];
        this.quizManager = ;
    }

    addUser(roomId: string, socket: Socket){
        this.users.push({
            socket, roomId
        })
        this.createHandlers(roomId, socket);
    }

    createHandlers(roomId: string, socket: Socket){
        socket.on('join', (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit('USER_ID', {userId});
        })

        socket.on( 'join_admin', (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            if(data.password !== ADMIN_PASSWORD){
                return;
            }
            socket.emit('adminInit', {
                userId,
                state: this.quizManager.getCurrentState()
            }
        }

        socket.on('submit', (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.roomId;

            if(submission !=0 && submission != 1 && submission != 2 && submission != 3){
                console.error('Invalid submission');
                return;
            }

            this.quizManager.submit(roomId, userId, problemId, submission);
        }

    }
}