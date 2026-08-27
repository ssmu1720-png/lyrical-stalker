# Verification Notes

## Live API check

On 2026-08-27, the provided endpoint returned HTTP 200 for `username=__` with `status: true`. The response shape observed in-browser was:

- `status`: boolean
- `creator`: string
- `username`: string
- `result.metadata.username`: string
- `result.metadata.fullName`: string
- `result.metadata.posts`: string
- `result.metadata.followers`: string
- `result.metadata.following`: string
- `result.metadata.avatar`: URL string
- `result.metadata.bio`: multiline string
- `result.stories.data.status`: string
- `result.stories.data.code`: number
- `result.stories.data.username`: string
- `result.stories.data.country`: string
- `result.stories.data.serverType`: string
- `result.stories.data.serverCode`: number

## Browser flow

A handle was entered, Enter submitted the form, the loading state rendered, and the success state resolved with the profile identity, audience counters, schema key list, story service state, and pretty-printed raw response. The observed example returned `posts: 328`, `followers: 4K`, `following: 83`, and a story service error state with country `CA` and server code `8`; this is displayed as returned data, not fabricated content.
