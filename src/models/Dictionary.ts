import DictionaryRows from "@/models/DictionaryRows";

export default interface Dictionary {
  id: string;
  name: string;
  rowMap: DictionaryRows;
}
