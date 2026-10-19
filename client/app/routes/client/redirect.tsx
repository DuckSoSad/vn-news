import { redirect } from 'react-router';

export function clientLoader() {
  return redirect('/home');
}

export default function Redirect() {
  return null;
}
