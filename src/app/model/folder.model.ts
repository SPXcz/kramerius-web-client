export class Folder {

    pid: string;
    name: string;
    items: any[];
    user: string;

    static fromJson(json): Folder {
        if (json) {
            const folder = new Folder();
            folder.pid = json['uuid'];
            folder.name = json['name'];
            let items = [];
            for (let item of json['items'][0]) {
                if (item['id']) {
                    items.push(item['id']);
                }
            }
            folder.items = items;
            return folder;
        }
        return null;
    }
}