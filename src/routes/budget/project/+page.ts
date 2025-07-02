export async function load({ url }) {
    const searchTerm = url.searchParams.get('q');
    const projectId = url.searchParams.get('id');

    return {
        searchTerm,
        projectId
    };
}
