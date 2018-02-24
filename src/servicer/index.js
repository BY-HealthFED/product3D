import request from "~/core/request";


export function jsSDK(data){
	return request.post('/common/auth/JsSdkAuth.do', data);
}
