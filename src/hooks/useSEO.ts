import { useEffect } from "react";

export const useSEO = (title: string, description?: string) => {
    useEffect(() => {
        document.title = `${title} | Ananth N - Genesis Folio`;

        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);
        }
    }, [title, description]);
};
