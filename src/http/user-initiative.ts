import { post } from '.';

export interface IIssuesPayload {
  concact: string;
  type: 'suggestion' | 'feedback';
  description: string;
}

/** submit blog issues */
export const postIssues = (data: IIssuesPayload) => {
  return post('/issues', data);
};
