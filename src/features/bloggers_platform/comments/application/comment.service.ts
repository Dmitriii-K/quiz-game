import { Injectable } from "@nestjs/common";
import { CommentRepository } from "../repository/comment.typeorm.repository";

@Injectable()
export class CommentService{
    constructor(private commentRepository: CommentRepository) {}

    async findComment(id: string) {
        const comment = await this.commentRepository.findComment(id);
        if (!comment) {
            return null;
        } else {
            return comment;
        }
    }
    
    async updateComment(id: string, content: string) {
        const updateResult = await this.commentRepository.updateComment(id, content);
        if (updateResult) {
            return updateResult;
        } else {
            return false;
        }
    }

    async deleteComment(id: string) {
        const deleteResult = await this.commentRepository.deleteComment(id);
        if (deleteResult) {
            return true;
        } else {
            return false;
        }
    }
}