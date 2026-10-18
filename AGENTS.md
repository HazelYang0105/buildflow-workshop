<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep social permission review in the dedicated `/connections` route; disable provider authorization until a linked client and real app-user authentication exist, so consent is never simulated.
- Keep the shared concert masthead and navigation in Shell and express visual roles through global semantic tokens so all content pages maintain the same identity.
- Fetch public YouTube uploads through a server function using a server-only helper and the saved key in a request header; keep live channel content separate from fictional demo briefs to avoid false attribution.
