import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const gifsDirectory = path.join(process.cwd(), 'public', 'gifs');

    fs.readdir(gifsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to load GIFs' });
        }

        // Filter out only .gif files
        const gifs = files.filter(file => file.endsWith('.gif'));
        res.status(200).json(gifs);
    });
}
