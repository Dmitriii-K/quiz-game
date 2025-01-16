import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Put, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CommentViewModel } from "./models/output.model";
import { CommentQueryRepository } from "../repository/comment.sql.query-repository";
import { CommentService } from "../application/comment.service";
import { CommentInputModel } from "./models/input.model";
import { Request, Response } from "express";
import { LikeStatusDto } from "src/features/bloggers_platform/likes/api/models/input.model";
import { JwtAuthGuard } from "src/infrastructure/guards/jwt-auth.guard";
import { SoftAuthGuard } from "src/infrastructure/guards/dubl-guards/soft-auth.guard";
import { LikeStatusCommand } from "../application/use-cases/like-status";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    constructor(
        private commentQueryRepository: CommentQueryRepository,
        private commentService: CommentService,
        private commandBus: CommandBus
    ) {}
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id/like-status')//---------------
    @HttpCode(204)
    async likeStatus(
        @Param('id') id: string,
        @Body() body: LikeStatusDto,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
            const user = req.user ? req.user : null;
            if(!user) throw new UnauthorizedException()
            // console.log('userId', user.userId);//-------------------
            const comment = await this.commentQueryRepository.findCommentById(id, user.userId);
            if (!comment || !user) {
                throw new NotFoundException();
            }
            // const result = await this.likeStatusUseCase.execute(user, body.likeStatus, comment);
            const result = await this.commandBus.execute(new LikeStatusCommand(user.userId, body.likeStatus, comment));
            return result;
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')//---------------
    @HttpCode(204)
    async updateComment(
        @Param('id') id: string,
        @Body() body: CommentInputModel,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
            const comment = await this.commentService.findComment(id);
            if (!comment) {
                throw new NotFoundException();
            } else {
                if (req.user?.userId !== comment.userId) {
                    throw new ForbiddenException();
                }
                const updateResult = await this.commentService.updateComment(id, body.content);
                return updateResult;
            }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')//------------
    @HttpCode(204)
    async deleteComment(
        @Param('id') id: string,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
            const comment = await this.commentService.findComment(id);
            if (!comment) {
                throw new NotFoundException();
            } 
            else {
                if (req.user?.userId !== comment.userId) {
                    throw new ForbiddenException();
                }
                const deleteComment = await this.commentService.deleteComment(id);
                return deleteComment;
            }
    }

    @UseGuards(SoftAuthGuard)
    @Get(':id')//---------------
    async getComment(
        @Param('id') id: string,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
        const userId: string | null = req.user ? req.user.userId : null;
        // console.log('userId', userId);//-------------------
        // console.log('commentId', id);//-------------------
        const comment: CommentViewModel | null = await this.commentQueryRepository.findCommentById(id, userId);
        if (!comment) {
            throw new NotFoundException();
        }
        return comment;
    }
}