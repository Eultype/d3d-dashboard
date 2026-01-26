export function isImageUrl(url: string) {
    return /\.(webp|png|jpg|jpeg|gif)$/i.test(url);
}
