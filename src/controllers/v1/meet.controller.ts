/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Database from '@libraries/database.lib';
import { Context } from 'koa';
import { isContext } from 'vm';
import { request } from 'websocket';
import {apiCall as api} from '@middlewares/api.middleware';

class MeetCreateReq {
    public name = '';

    public host = 0;

    public point_x = 0;

    public point_y = 0;

    public max_num = 0;

    public ex_distance = 0;

    public ex_start_time ='';
    
    public ex_end_time = '';

    public level = 0;
}

class MeetSearchReq {
    public point_x = 0;

    public point_y = 0;

    public max_distance = 0;

    public limit = 0;
}

class MeetJoinReq {
    public user_id = 0;

    public meet_id = 0;
}


export class MeetingController {
    public static test(ctx : Context) {
        const arr = [10, 230, 0, 21];
        ctx.body = api.returnBadReqest();
    }

     // ===================================미팅 생성 api=======================================

    public static async createMeeting(ctx : Context) {
        // api 유효성 검사
        const req = ctx.request.body;     
        if(api.checkValidation(new MeetCreateReq(), req) === false) {
            api.printConsole(' Meet Create api 검증 실패')
            ctx.response.status = 400;
            return ctx.body = api.returnBadReqest();
        };

        // 중복된 미팅 이름 검사
        const DbCheckResult : any = await Database.query('SELECT * FROM MEET WHERE NAME = ?', req.name);
        if (DbCheckResult[0] !== undefined) {
            api.printConsole(' Meet Create api 이름 중복 오류')
            ctx.response.status = 403;
            return ctx.body = api.returnBasicRequest(false, ctx.response.status, "이미 이름이 존재하는 미팅입니다.");
        }

        // MEET 테이블 INSERT
        try {
            const point = `POINT(${req.point_y}, ${req.point_x})`;
            await Database.query(`INSERT INTO MEET (NAME, HOST, POINT, MAX_NUM, EX_DISTANCE, EX_START_TIME, EX_END_TIME, LEVEL) VALUE (?, ?, ${ point }, ?, ?, ?, ?, ?)`,
                [req.name, req.host, req.max_num, req.ex_distance, req.ex_start_time, req.ex_end_time, req.level]);
            api.printConsole(' Meet Create api 미팅 생성 성공');
            return ctx.body = api.returnSuccessRequest('미팅 생성에 성공하였습니다.');
        }
        // API 입력시 Datetime 형식을 따르지 않을 경우 오류
        catch (err : any) {
            api.printConsole(' Meet Create api DB Insert 오류');
            ctx.response.status = 400;
            return ctx.body = api.returnBasicRequest(false, ctx.response.status, err.message);
        }
    }

    // +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+= 미팅 생성 api 끝 +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=

    // ===================================미팅 조회 api=======================================
     public static async searchMeeting (ctx: Context) {
        // api 유효성 검사
        const req = ctx.request.body;     
        if(api.checkValidation(new MeetSearchReq(), req) === false) {
            api.printConsole(' Meet Search api 검증 실패')
            ctx.response.status = 400;
            return ctx.body = api.returnBadReqest();
        };

        // MEET 테이블을 입력받은 거리 내로 조회
        try {
            const point = `POINT(${req.point_y}, ${req.point_x})`;

            const dbResult = await Database.query(
                `SELECT *, ST_DISTANCE_SPHERE(${point}, POINT) AS DIST FROM MEET 
                WHERE st_distance_sphere(Point(127.1210368, 37.3817369), point) < ${req.max_distance}
                ORDER BY DIST
                LIMIT ${req.limit}`);

            api.printConsole(' Meet Search 성공');
            ctx.body = Object.assign(api.returnSuccessRequest('미팅 조회에 성공하였습니다.'),  { results : dbResult });
        }
        // DB Insertion 오류
        catch (err:any) {
            api.printConsole(' Meet Search api DB Insert 오류');
            ctx.response.status = 400;
            return ctx.body = api.returnBasicRequest(false, ctx.response.status, err.message);
        }
     }
    // +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+= 미팅 조회 api 끝 +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=

    // ===================================미팅 참여 api=======================================
    public static async joinMeeting (ctx: Context) {
        // api 유효성 검사
        const req = ctx.request.body;     
        if(api.checkValidation(new MeetJoinReq(), req) === false) {
            api.printConsole(' Meet Join api 검증 실패')
            ctx.response.status = 400;
            return ctx.body = api.returnBadReqest();
        };

        try {
            await Database.query(`INSERT INTO LIST (MEET_ID, USER_ID) VALUE (${req.user_id}, ${req.meet_id})`);
            await Database.query(`INSERT INTO MEETLOG (MEET_ID, USER_ID, CODE, CONTENT) VALUE (${req.user_id}, ${req.meet_id}, 00, '[Meeting 조인]')`);
            api.printConsole(' Meet Join 성공');
            return ctx.body = api.returnSuccessRequest('미팅 참여에 성공하였습니다.');
        }
        catch (err:any) {
            api.printConsole(' Meet Search api DB Insert 오류');
            ctx.response.status = 400;
            return ctx.body = api.returnBasicRequest(false, ctx.response.status, err.message);
        }


    }

    // +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+= 미팅 참여 api 끝 +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=


    public static async test2(ctx : Context) {
        const result : any = await Database.query('SELECT POINT FROM MEET WHERE UID = 15');
        console.log(result[0]);
        ctx.body = "dssdaf";
    }
}