/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JudgeConfig } from './JudgeConfig';
import type { UserVO } from './UserVO';
export type QuestionVO = {
    acceptNum?: number;
    content?: string;
    createTime?: string;
    id?: number;
    judgeConfig?: JudgeConfig;
    submitNum?: number;
    tags?: Array<string>;
    title?: string;
    user?: UserVO;
    userId?: number;
};

