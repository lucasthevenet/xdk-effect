# Changelog

## 0.2.0

- Require stable Effect 4 (`>=4.0.0 <5`); prerelease Effect releases are no longer supported.
- Migrate HTTP module paths, Config constructors, and Base64/Base64Url encoding.
- Align Distilled core at 1.0.0-rc.13 and platform-browser/platform-bun at 4.0.0.
- Validate response schemas while retaining mapped wire fields, including nested legacy `referenced_tweets` metadata.
- Preserve Bun/Worker TypeScript source exports and Node compiled JavaScript/declarations.

### Migration from 0.1.0

Upgrade Effect and related platform packages together to stable 4.0.0. Replace `effect/unstable/http/*` imports with `effect/http/*`, lowercase Config constructors with capitalized constructors, and `effect/Encoding` with the appropriate modules from `effect/encoding` in consumer code. Remove the temporary xdk-effect@0.1.0 Bun patch after installing this release; dependency overrides added solely for the SDK can then be reviewed for removal. Public SDK export paths remain unchanged.

Unknown wire fields are retained only after known schema fields validate. Legacy reference fields remain wire metadata: applications must validate reference type and ID before using them to classify roots or replies.
