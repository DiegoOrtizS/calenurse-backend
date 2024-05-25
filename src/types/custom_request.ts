import { Request } from 'express';

export interface CustomRequest<Body, Params={}> extends Request<{}, {}, Body, Params>{
  body: Body
  params: Params
}