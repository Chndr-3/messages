import { readFile, writeFile } from 'fs/promises';


export class MessagesRepository {
    async findOne(id: string) {
        const contents = await readFile('messages.json', 'utf8');
        const messages = JSON.parse(contents);
        return messages[id];
    }

    async findAll() {
        console.log('Finding all messages');
        this.createIfEmpty();
        console.log('Ensured default message exists');
        const contents = await readFile('messages.json', 'utf8');
        return JSON.parse(contents);
    }

    async create(content: string) {
        const contents = await readFile('messages.json', 'utf8');
        const messages = JSON.parse(contents);
        const id = Math.floor(Math.random() * 999).toString();
        messages[id] = { id: id, content: content };
        await writeFile('messages.json', JSON.stringify(messages));
        return id;
    }

    async createIfEmpty() {
        let messages = {};

        try {
            const contents = await readFile('messages.json', 'utf8');
            if (contents.trim()) {
                messages = JSON.parse(contents);
            } else {
                console.log('⚠️ File is empty — initializing...');
            }
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                console.log('⚠️ File not found — creating new messages.json...');
                await writeFile('messages.json', '{}');
            } else {
                console.error('❌ Error reading file:', err);
                throw err;
            }
        }

        if (Object.keys(messages).length === 0) {
            const id = Math.floor(Math.random() * 999).toString();
            messages[id] = { id, content: 'Hello World' };
            await writeFile('messages.json', JSON.stringify(messages, null, 2));
            console.log('✅ File initialized with default message');
        }
    }

}