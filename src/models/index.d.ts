import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class TagReports {
  readonly id: string;
  readonly tagNumber: string;
  readonly fishType: string;
  readonly tagDate: string;
  readonly tagLocation: string;
  readonly tagArea: string;
  readonly comment: string;
  readonly guideName: string;
  readonly fishLength: string;
  readonly fishWeight?: string;
  readonly email: string;
  readonly phone: string;
  readonly pictureUrl?: string;
  readonly owner?: string;
  readonly recapture?: string;
  constructor(init: ModelInit<TagReports>);
  static copyOf(source: TagReports, mutator: (draft: MutableModel<TagReports>) => MutableModel<TagReports> | void): TagReports;
}