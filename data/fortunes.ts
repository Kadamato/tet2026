import xamData from './xam.json';

export interface Fortune {
    id: number;
    title: string;
    poem: string[];
    meaning: string;
    interpretation: string;
}

// Map the JSON data to our Fortune interface
export const FORTUNES: Fortune[] = xamData.que.map((item) => ({
    id: item.id,
    title: `${item.ten} (${item.phan_loai || 'Bình thường'})`,
    // Split poem by newlines and trim whitespace
    poem: item.ke_goc ? item.ke_goc.split('\n').map(line => line.trim()).filter(line => line.length > 0) : [],
    // Use phan_loai as the meaning summary if available, otherwise a default string
    meaning: item.phan_loai || "Vận mệnh tùy thuộc vào lòng người.",
    // Use the folk explanation, removing the $$$ marker if present
    interpretation: item.luan_giai_dan_gian ? item.luan_giai_dan_gian.replace(/\$\$\$/g, '').trim() : "Chưa có lời giải chi tiết."
}));
