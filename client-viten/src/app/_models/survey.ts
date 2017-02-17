

export class Question {
  txt: string;
  options: string[];
}

export class Lang {
  en: Question;
  no: Question;
}

export class QuestionObject {
  mode: string; // allowed values: 'binary', 'star', 'multi', 'smily', 'text'
  answer: number[];
  lang: Lang;

}

export class EndMessage {
  no: string;
  en: string;
}

export class Survey {
  _id: string;
  name: string;
  comment: string;
  date: string;
  active: boolean;
  endMessage: EndMessage;
  questionlist: QuestionObject[];
}

/*
    EXAMPLE SURVEY:


    let validJsonObject = {
      "name": "måneraketten3",
      "date": "2012-04-23T18:25:43.511Z",
      "active": true,
      "questionlist": [{
        "mode": "smily",
        "answer": [1,2,1,2,1,2,1,2],
        "lang": {
          "en": {
            "txt": "what do you think about mars?",
            "options": ["AWSOME","coooool","blody iron planet"]
          },
          "no": {
            "txt": "Hva synes du om Mars?",
            "options": ["UTROLIG","kuuuuul","jevla jernplanet"]
          },
        },
      }],
      "endMessage": {
        "no": "Takk for at du gjennomførte denne undersøkelsen!"
      }
    }

*/
