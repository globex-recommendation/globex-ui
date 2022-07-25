export class UserActivityModel {
  idSite: string;
  activity: Activity;
  userInfo: UserInfo;
  actionInfo: ActionInfo;
  constructor(idSite: string,     activity: Activity,    userInfo: UserInfo,    actionInfo: ActionInfo) {
    this.idSite = idSite;
    this.activity = activity;
    this.userInfo =  userInfo;
    this.actionInfo = actionInfo;
  }
}
export class Activity {
  userId: any;
  url: string;
  rand: string;
  type: string;
  
  constructor(userId: any,    url: string,    rand: string,     type: string) {
      this.userId = userId;
      this.url = url;
      this.rand = rand;
      this.type = type;
    }
}

export class UserInfo {
  visitsCount: number;
  prevVisitTs: number;
  firstVisitTs: number;
  campaign: string;
  newVisit: number;
  localTime: string;
  constructor(visitsCount: number,    prevVisitTs: number,    firstVisitTs: number,     campaign: string,     newVisit: number,    localTime: string) {
    this.visitsCount = visitsCount;
    this.prevVisitTs = prevVisitTs;
    this.firstVisitTs = firstVisitTs;
    this.campaign = campaign;
    this.newVisit = newVisit;
    this.localTime = localTime;
  }

}

export class ActionInfo {
  productId: string;
  search: string;
  searchCat: string;
  
  constructor(productId: string, search: string, searchCat: string) {
      this.productId = productId;
      this.search = search;
      this.searchCat = searchCat;
  }

}

