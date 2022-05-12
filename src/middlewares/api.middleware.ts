/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-restricted-syntax */


export class apiCall {
    // 서버 콘솔 출력 메소드
    public static printConsole(context : string) : void  {
        const dt = new Date();
        const temp = `   ==[server Log] [${  dt  }] : ${  context}`;
        console.log(temp);
    }
    
    // 입력받은 두 파라미터의 타입 체크 메소드
    public static ckType(base : any, target : any) : boolean {
        if (typeof base === typeof target)
            return true;
        return false; 
    }

    // API Request를 기준이 되는 클래스 인스턴스와 비교하여 검증하는 메소드
    // 사용하기 위해선 기준이 되는 클래스를 정의하여야 함
    public static checkValidation(base : any, target : any) : boolean{
        for (const key in base) if (true) {
            if (target[key] === undefined || this.ckType(base[key], target[key])===false) return false;
        }
        return true;
    }

    // api requset 기본 구조 반환 메소드들
    public static returnBasicRequest (isSuccess : boolean, code : number, message : string ) : object {
        const result =
        {
            "isSuccess" : isSuccess,
            "code":code,
            "message":message
        }
        return result;
    }

    public static returnSuccessRequest (message : string) : object {
        const result =
        {
            "isSuccess" : true,
            "code":200,
            "message":message
        }
        return result;
    }
    
    public static returnBadReqest () : object {
        const result =
        {
            "isSuccess" : false,
            "code":400,
            "message":"잘못된 요청입니다. api 명세서를 확인하세요."
        }
        return result;
    }
}
