// export class TableColumn {
//     constructor(public label:string, public data:Array<string>) {

//     }
// }
export class Table {
    public columns:Array<[string, string[]]>;
    
    
    constructor(){
        this.columns = Array<[string, string[]]>();
    }
    
    addTableColumn(label: string, values: string[]): void {
        this.columns.push([label, values]);
    }
    
    size(): number {
        return this.columns.length;    
    }
    print(){
        this.columns.forEach(element => {
            console.log(element);
        });
    }
}