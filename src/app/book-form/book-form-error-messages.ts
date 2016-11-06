export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}

export const BookFormErrorMessages = [
  new ErrorMessage('title', 'required', 'Ein Buchtitel muss angegeben werden'),
  new ErrorMessage('isbn', 'required', 'Es muss eine ISBN Nummer angegeben werden'),
  new ErrorMessage('isbn', 'minlength', 'Die ISBN Nummer muss mindestens 10 Zeichen enthalten'),
  new ErrorMessage('isbn', 'maxlength', 'Eine ISBN Nummer darf höchstens 13 Zeichen haben'),
  new ErrorMessage('published', 'required', 'Es muss ein Erscheinungsdatum angegeben werden'),
  new ErrorMessage('authors', 'required', 'Es muss ein Autor angegeben werden'),
];
