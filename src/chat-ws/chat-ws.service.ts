import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatWsService {
  //! THIS IS A TEMPORARY SOLUTION, WILL BE REPLACED WITH A REAL SOLUTION LATER
  private calls = {};

  handleMessage(client: any, message: string) {
    return client.broadcast.emit('message', message);
  }

  handleOffer(callId: string, offer: string) {
    this.calls[callId] = {
      offer,
      answerCandidates: [],
      offerCandidates: [],
    };
  }

  handleAnswer(client: Socket, callId: string, answer: string) {
    this.calls[callId].answer = answer;
    client.broadcast.emit('answer', answer);
    client.emit('offer', this.calls[callId].offer);
    client.emit('ice-offer', this.calls[callId].offerCandidates);
  }

  handleICECandidateOffer(client: Socket, callId: string, ice: string) {
    if (!this.calls[callId].offerCandidates) {
      this.calls[callId].offerCandidates = [ice];
    } else {
      this.calls[callId].offerCandidates.push(ice);
    }
  }

  handleICECandidateAnswer(client: Socket, callId: string, ice: string) {
    if (!this.calls[callId].answerCandidates) {
      this.calls[callId].answerCandidates = [ice];
    } else {
      this.calls[callId].answerCandidates.push(ice);
    }
    client.broadcast.emit('ice-answer', ice);
  }

  handleJoinCall(client: Socket, callId: string) {
    client.emit('join-call', callId, this.calls[callId].offer);
  }
}
