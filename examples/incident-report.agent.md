# Incident Report Example

> [!WARNING]
> agentdocs: callout
> title: Summary
>
> The rendered artifact failed to load because the source used arbitrary JavaScript outside an artifact block.

<!--agd:timeline title="Incident timeline"-->
| Time | Event | Impact |
|---|---|---|
| 09:00 | Invalid source committed | Build warning |
| 09:05 | Strict validation ran | CI failed |
| 09:12 | Source moved into artifact | Build recovered |
<!--/agd:timeline-->

<!--agd:decision status=approved owner="Maintainers"-->
Keep strict validation enabled in CI for all examples.
<!--/agd:decision-->
