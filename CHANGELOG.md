# Changelog

## [4.0.0-beta1](https://github.com/BobanL/dibbs-ecr-viewer/compare/v4.0.0-beta0...v4.0.0-beta1) (2025-04-02)


### ⚠ BREAKING CHANGES

* simplify auth vars ([#511](https://github.com/BobanL/dibbs-ecr-viewer/issues/511))

### Features

* add /api/process-zip endpoint in ecr-viewer ([#304](https://github.com/BobanL/dibbs-ecr-viewer/issues/304)) ([af8d1b3](https://github.com/BobanL/dibbs-ecr-viewer/commit/af8d1b3a71f5628a9baee7e5e14401cc4ef7339e))
* add db cipher env variable ([#257](https://github.com/BobanL/dibbs-ecr-viewer/issues/257)) ([62a1dca](https://github.com/BobanL/dibbs-ecr-viewer/commit/62a1dcae0e769d6fed3858063b024b163a7b4513))
* add dependencies and version as part of the /health-check ([#455](https://github.com/BobanL/dibbs-ecr-viewer/issues/455)) ([b77abfe](https://github.com/BobanL/dibbs-ecr-viewer/commit/b77abfec6e21af50bcbc3c29a3dcf7bb1af0dcfa))
* add gcp support ([#549](https://github.com/BobanL/dibbs-ecr-viewer/issues/549)) ([51398b1](https://github.com/BobanL/dibbs-ecr-viewer/commit/51398b1a87af470b8fcdd7174ba1a3e43abdbbd3))
* add Github Actions workflow to trigger VM build ♍  ([#263](https://github.com/BobanL/dibbs-ecr-viewer/issues/263)) ([e7d9d2a](https://github.com/BobanL/dibbs-ecr-viewer/commit/e7d9d2ab467a434b9101dcb8b9649fbcb651bd0f))
* add more fhir converter features ([#15](https://github.com/BobanL/dibbs-ecr-viewer/issues/15)) ([d967818](https://github.com/BobanL/dibbs-ecr-viewer/commit/d9678183d2ad185b297b5a20503a1aa3146c75b6))
* add new redirect handler in next auth ([#4](https://github.com/BobanL/dibbs-ecr-viewer/issues/4)) ([63f4e53](https://github.com/BobanL/dibbs-ecr-viewer/commit/63f4e538a172d9e3e88f9fb1592d442c3d6695f2))
* add patient address table to extended schema ([#285](https://github.com/BobanL/dibbs-ecr-viewer/issues/285)) ([c52071d](https://github.com/BobanL/dibbs-ecr-viewer/commit/c52071df9d30515121c22e76a7cdceef39a1edad))
* add patient/guardian info, refactor formatters a bit ([#484](https://github.com/BobanL/dibbs-ecr-viewer/issues/484)) ([345331c](https://github.com/BobanL/dibbs-ecr-viewer/commit/345331c4e4a7d4e7e65f0e1966b707d521031a41))
* Add race and ethnicity to eCR Summary ([#481](https://github.com/BobanL/dibbs-ecr-viewer/issues/481)) ([2fad5f6](https://github.com/BobanL/dibbs-ecr-viewer/commit/2fad5f64291579cdd574ab6f14c00f4f45fa259a))
* add search param validation middleware ([#486](https://github.com/BobanL/dibbs-ecr-viewer/issues/486)) ([8338775](https://github.com/BobanL/dibbs-ecr-viewer/commit/83387754b02a339514a9b22f04a1c8b834694acb))
* add version number as tag if available ([#264](https://github.com/BobanL/dibbs-ecr-viewer/issues/264)) ([1d79d3a](https://github.com/BobanL/dibbs-ecr-viewer/commit/1d79d3a275b9452c7c7b701cd56e66765de1c811))
* Age calculation fixes (app-wide) ([#463](https://github.com/BobanL/dibbs-ecr-viewer/issues/463)) ([5f3e679](https://github.com/BobanL/dibbs-ecr-viewer/commit/5f3e6796fbc863decda582990ec964b1dd9dc541))
* do more with fhir-converter ([#10](https://github.com/BobanL/dibbs-ecr-viewer/issues/10)) ([e8523f5](https://github.com/BobanL/dibbs-ecr-viewer/commit/e8523f5facc94a56201cb475660c3c753bbc37b1))
* do something with fhir-converter ([#8](https://github.com/BobanL/dibbs-ecr-viewer/issues/8)) ([5f05478](https://github.com/BobanL/dibbs-ecr-viewer/commit/5f05478f0d74e9969f1fb535988a21eaea14f499))
* dual boot mode ([#568](https://github.com/BobanL/dibbs-ecr-viewer/issues/568)) ([2f4e518](https://github.com/BobanL/dibbs-ecr-viewer/commit/2f4e51879bb0a19556c3d20cc1c82b8f4b8e68ed))
* **ecr-viewer:** Add Keysely DB adapter ([#280](https://github.com/BobanL/dibbs-ecr-viewer/issues/280)) ([cf3ab1f](https://github.com/BobanL/dibbs-ecr-viewer/commit/cf3ab1fa464580b8dc2fdbf80f2a29c91b54e8f2))
* enable auth in middleware ([#349](https://github.com/BobanL/dibbs-ecr-viewer/issues/349)) ([613ffca](https://github.com/BobanL/dibbs-ecr-viewer/commit/613ffcae8fa0fcd447e4c92a7cc2826572aabdcb))
* improve capabilities of rctc-to-json ([#17](https://github.com/BobanL/dibbs-ecr-viewer/issues/17)) ([53699b7](https://github.com/BobanL/dibbs-ecr-viewer/commit/53699b7d5ea37564aa54d8d9a34f07d726cb7f62))
* make AZURE_CONTAINER_NAME optional in favor of ECR_BUCKET_NAME ([#560](https://github.com/BobanL/dibbs-ecr-viewer/issues/560)) ([c76fcab](https://github.com/BobanL/dibbs-ecr-viewer/commit/c76fcab5514bcee499757111543760c713b65f31))
* replace eRSD & RCKMS data with TES API data in TCRS ([#532](https://github.com/BobanL/dibbs-ecr-viewer/issues/532)) ([4e66412](https://github.com/BobanL/dibbs-ecr-viewer/commit/4e66412ff9173804f33eb54e70cb6960dc0228bc))
* replace STRING_AGG in order to support sqlserver 2016 ([#476](https://github.com/BobanL/dibbs-ecr-viewer/issues/476)) ([2aec965](https://github.com/BobanL/dibbs-ecr-viewer/commit/2aec965b47c40477b133b96803fcfc6c080bebf5))
* setup azure ad (aka entra id) provider ([#347](https://github.com/BobanL/dibbs-ecr-viewer/issues/347)) ([1ab22da](https://github.com/BobanL/dibbs-ecr-viewer/commit/1ab22dac8a5b99a3dc4e92c4394886c28abb400a))
* setup keycloak provider ([#346](https://github.com/BobanL/dibbs-ecr-viewer/issues/346)) ([942dcfe](https://github.com/BobanL/dibbs-ecr-viewer/commit/942dcfe405e88ca7d37d454cc1db187ee71af76d))
* simplify auth vars ([#511](https://github.com/BobanL/dibbs-ecr-viewer/issues/511)) ([717ccf4](https://github.com/BobanL/dibbs-ecr-viewer/commit/717ccf46a6164a731a9bb46637311ae29ada7290))


### Bug Fixes

* "eCR Library" should be a header to support screen readers ([#306](https://github.com/BobanL/dibbs-ecr-viewer/issues/306)) ([59a7bca](https://github.com/BobanL/dibbs-ecr-viewer/commit/59a7bca33c195132b919e9b3d2b0baa0236c64c5))
* add "no eCR" message when no data listed ([#330](https://github.com/BobanL/dibbs-ecr-viewer/issues/330)) ([c5e278b](https://github.com/BobanL/dibbs-ecr-viewer/commit/c5e278b2a5650863e59ee623f7d9f537c1080873))
* add revalidate on /health-check to force refresh ([#539](https://github.com/BobanL/dibbs-ecr-viewer/issues/539)) ([c44ca74](https://github.com/BobanL/dibbs-ecr-viewer/commit/c44ca74c7c8f3aafe5173742111f75e7fee89b37))
* anchor tag css and sidenav activation handling ([#320](https://github.com/BobanL/dibbs-ecr-viewer/issues/320)) ([c35557e](https://github.com/BobanL/dibbs-ecr-viewer/commit/c35557e9093cf0bf5e8489b2d598e7a6b46dc865))
* botched merge ([#332](https://github.com/BobanL/dibbs-ecr-viewer/issues/332)) ([242aa96](https://github.com/BobanL/dibbs-ecr-viewer/commit/242aa96fc5fb1e06dbe3102cdac575adfb877c1d))
* change ecr_viewer_url to use host.docker.internal ([#482](https://github.com/BobanL/dibbs-ecr-viewer/issues/482)) ([d93b038](https://github.com/BobanL/dibbs-ecr-viewer/commit/d93b038fa029f99f88741acfa69ffbaf2e4645c1))
* correct spelling of "Reportibility" to "Reportability"  ([#342](https://github.com/BobanL/dibbs-ecr-viewer/issues/342)) ([427ebc3](https://github.com/BobanL/dibbs-ecr-viewer/commit/427ebc3413aa9673169ea8e228ec51cd482c2435))
* Correctly get human readable condition names ([#283](https://github.com/BobanL/dibbs-ecr-viewer/issues/283)) ([58490a2](https://github.com/BobanL/dibbs-ecr-viewer/commit/58490a210328bf3f3d44930433dfd168ce7905fa))
* eCR Library wrapper is inaccessible when no eCRs are found ([#548](https://github.com/BobanL/dibbs-ecr-viewer/issues/548)) ([21e27ce](https://github.com/BobanL/dibbs-ecr-viewer/commit/21e27cea23b87a9decdf09f279122a2c54e05bac))
* Empty author practitioner ([#480](https://github.com/BobanL/dibbs-ecr-viewer/issues/480)) ([e4912b1](https://github.com/BobanL/dibbs-ecr-viewer/commit/e4912b18496fe3efdde5eee74cccc3cda7111aff))
* encounter date sorting ([#265](https://github.com/BobanL/dibbs-ecr-viewer/issues/265)) ([40e69e1](https://github.com/BobanL/dibbs-ecr-viewer/commit/40e69e13c7456ba260545ac1a673f8835a87fe86))
* generify vital sign evaluation and display ([#567](https://github.com/BobanL/dibbs-ecr-viewer/issues/567)) ([d6c41c8](https://github.com/BobanL/dibbs-ecr-viewer/commit/d6c41c8c1553de9bca5a3adb6e44a10f8eedf339))
* handle more phone number formats and fail more gracefully ([#561](https://github.com/BobanL/dibbs-ecr-viewer/issues/561)) ([b880773](https://github.com/BobanL/dibbs-ecr-viewer/commit/b8807733efcdfb4d36aff8d5c5bb4617e8a1d36b))
* library user preferences ([#406](https://github.com/BobanL/dibbs-ecr-viewer/issues/406)) ([ed17669](https://github.com/BobanL/dibbs-ecr-viewer/commit/ed176698f5d643f9e79ac52072f3aeff856588c6))
* Misc notes display bug ([#562](https://github.com/BobanL/dibbs-ecr-viewer/issues/562)) ([0415602](https://github.com/BobanL/dibbs-ecr-viewer/commit/0415602608f8e64006e0dd50aaa90086c4ff381f))
* my bad merge ([#313](https://github.com/BobanL/dibbs-ecr-viewer/issues/313)) ([3359a0c](https://github.com/BobanL/dibbs-ecr-viewer/commit/3359a0cb81b8acd4fd9d7dff0ab086efa02042c4))
* next-auth url base path to be dynamic ([#506](https://github.com/BobanL/dibbs-ecr-viewer/issues/506)) ([e186dc8](https://github.com/BobanL/dibbs-ecr-viewer/commit/e186dc854334816e666debbe2ac0afb0bf89c5ee))
* pagination button hover styling ([#402](https://github.com/BobanL/dibbs-ecr-viewer/issues/402)) ([630c143](https://github.com/BobanL/dibbs-ecr-viewer/commit/630c1438ac81fb2fe171ebc449d3f74c0445d893))
* patient information won't display when values are missing ([#271](https://github.com/BobanL/dibbs-ecr-viewer/issues/271)) ([11fdbec](https://github.com/BobanL/dibbs-ecr-viewer/commit/11fdbecc36c6f3be4a24d181174f66d3e2cf10a5))
* phdi =&gt; dibbs-ecr-viewer ([#419](https://github.com/BobanL/dibbs-ecr-viewer/issues/419)) ([4a92b34](https://github.com/BobanL/dibbs-ecr-viewer/commit/4a92b34f4d8486fd0dc5eea02ba9d4434b2788dd))
* process-zip saving metadata ([#553](https://github.com/BobanL/dibbs-ecr-viewer/issues/553)) ([0172fbf](https://github.com/BobanL/dibbs-ecr-viewer/commit/0172fbfdbf91f3d13c3542093a0b114a7bd9b474))
* remove debug console log from saveMetadataToSqlServer function ([#316](https://github.com/BobanL/dibbs-ecr-viewer/issues/316)) ([bf028e8](https://github.com/BobanL/dibbs-ecr-viewer/commit/bf028e8a7533e93770344249d47feb4795b15329))
* remove unnecessary key on `Header` ([#338](https://github.com/BobanL/dibbs-ecr-viewer/issues/338)) ([14f484e](https://github.com/BobanL/dibbs-ecr-viewer/commit/14f484eb720e9641feff3ab461e18236ef0a9c83))
* remove unnecessary key on filter condition div ([#396](https://github.com/BobanL/dibbs-ecr-viewer/issues/396)) ([1c864cc](https://github.com/BobanL/dibbs-ecr-viewer/commit/1c864cc92c100ba987925dca5074427c48d8af7c))
* remove unused /fhir-api REST api route ([#572](https://github.com/BobanL/dibbs-ecr-viewer/issues/572)) ([7279418](https://github.com/BobanL/dibbs-ecr-viewer/commit/72794189bad7cb5e4c3973dc331b623b665453ef))
* rename report_date to encounter_date in EcrTableClient ([#308](https://github.com/BobanL/dibbs-ecr-viewer/issues/308)) ([29135f7](https://github.com/BobanL/dibbs-ecr-viewer/commit/29135f757622c86a715c784db7edce3c9be10d99))
* Reportability Summary table should not be visible when no data is available ([#452](https://github.com/BobanL/dibbs-ecr-viewer/issues/452)) ([7b6beb0](https://github.com/BobanL/dibbs-ecr-viewer/commit/7b6beb01471a1755d3f1d493d91188ab4cc312d2))
* restore ecr library table stickiness ([#405](https://github.com/BobanL/dibbs-ecr-viewer/issues/405)) ([162f17a](https://github.com/BobanL/dibbs-ecr-viewer/commit/162f17a5194458e7a242299608fafb1f04312233))
* side nav scroll ([#491](https://github.com/BobanL/dibbs-ecr-viewer/issues/491)) ([03dc19d](https://github.com/BobanL/dibbs-ecr-viewer/commit/03dc19d5dd0d1400a1bf9ce8408b45efd1da8570))
* update aria-labels to filter buttons when active ([#471](https://github.com/BobanL/dibbs-ecr-viewer/issues/471)) ([c796864](https://github.com/BobanL/dibbs-ecr-viewer/commit/c79686439809e8364e43f34135cdc67a10f45efa))
* update back button image to be aria hidden ([#314](https://github.com/BobanL/dibbs-ecr-viewer/issues/314)) ([4d8af71](https://github.com/BobanL/dibbs-ecr-viewer/commit/4d8af7118adc2c2f00a4b47ce00967dfa5082df3))
* update heading levels and move Immunizations to under Clinical S… ([#333](https://github.com/BobanL/dibbs-ecr-viewer/issues/333)) ([d381e5f](https://github.com/BobanL/dibbs-ecr-viewer/commit/d381e5f5e3b79bea195859dae13385d8dec52e7f))
* use latest fhir converter to escape warning text ([#500](https://github.com/BobanL/dibbs-ecr-viewer/issues/500)) ([0bfda42](https://github.com/BobanL/dibbs-ecr-viewer/commit/0bfda42052d342cc49bd66af4a9426c1d28909fe))
* use onset age if available, only calculate if date present ([#414](https://github.com/BobanL/dibbs-ecr-viewer/issues/414)) ([bce4f01](https://github.com/BobanL/dibbs-ecr-viewer/commit/bce4f01c64cfae2004a66a0a467a6b098fa86343))


### Performance Improvements

* make ecr viewer page ssr ([#266](https://github.com/BobanL/dibbs-ecr-viewer/issues/266)) ([0ce9643](https://github.com/BobanL/dibbs-ecr-viewer/commit/0ce9643597aecd5293bde4647bdce6993fd5e536))

## [4.0.0-beta0](https://github.com/BobanL/dibbs-ecr-viewer/compare/dibbs-ecr-viewer-v3.3.0...dibbs-ecr-viewer-v4.0.0-beta0) (2025-04-02)


### ⚠ BREAKING CHANGES

* simplify auth vars ([#511](https://github.com/BobanL/dibbs-ecr-viewer/issues/511))

### Features

* add /api/process-zip endpoint in ecr-viewer ([#304](https://github.com/BobanL/dibbs-ecr-viewer/issues/304)) ([af8d1b3](https://github.com/BobanL/dibbs-ecr-viewer/commit/af8d1b3a71f5628a9baee7e5e14401cc4ef7339e))
* add db cipher env variable ([#257](https://github.com/BobanL/dibbs-ecr-viewer/issues/257)) ([62a1dca](https://github.com/BobanL/dibbs-ecr-viewer/commit/62a1dcae0e769d6fed3858063b024b163a7b4513))
* add dependencies and version as part of the /health-check ([#455](https://github.com/BobanL/dibbs-ecr-viewer/issues/455)) ([b77abfe](https://github.com/BobanL/dibbs-ecr-viewer/commit/b77abfec6e21af50bcbc3c29a3dcf7bb1af0dcfa))
* add gcp support ([#549](https://github.com/BobanL/dibbs-ecr-viewer/issues/549)) ([51398b1](https://github.com/BobanL/dibbs-ecr-viewer/commit/51398b1a87af470b8fcdd7174ba1a3e43abdbbd3))
* add Github Actions workflow to trigger VM build ♍  ([#263](https://github.com/BobanL/dibbs-ecr-viewer/issues/263)) ([e7d9d2a](https://github.com/BobanL/dibbs-ecr-viewer/commit/e7d9d2ab467a434b9101dcb8b9649fbcb651bd0f))
* add more fhir converter features ([#15](https://github.com/BobanL/dibbs-ecr-viewer/issues/15)) ([d967818](https://github.com/BobanL/dibbs-ecr-viewer/commit/d9678183d2ad185b297b5a20503a1aa3146c75b6))
* add new redirect handler in next auth ([#4](https://github.com/BobanL/dibbs-ecr-viewer/issues/4)) ([63f4e53](https://github.com/BobanL/dibbs-ecr-viewer/commit/63f4e538a172d9e3e88f9fb1592d442c3d6695f2))
* add patient address table to extended schema ([#285](https://github.com/BobanL/dibbs-ecr-viewer/issues/285)) ([c52071d](https://github.com/BobanL/dibbs-ecr-viewer/commit/c52071df9d30515121c22e76a7cdceef39a1edad))
* add patient/guardian info, refactor formatters a bit ([#484](https://github.com/BobanL/dibbs-ecr-viewer/issues/484)) ([345331c](https://github.com/BobanL/dibbs-ecr-viewer/commit/345331c4e4a7d4e7e65f0e1966b707d521031a41))
* Add race and ethnicity to eCR Summary ([#481](https://github.com/BobanL/dibbs-ecr-viewer/issues/481)) ([2fad5f6](https://github.com/BobanL/dibbs-ecr-viewer/commit/2fad5f64291579cdd574ab6f14c00f4f45fa259a))
* add search param validation middleware ([#486](https://github.com/BobanL/dibbs-ecr-viewer/issues/486)) ([8338775](https://github.com/BobanL/dibbs-ecr-viewer/commit/83387754b02a339514a9b22f04a1c8b834694acb))
* add version number as tag if available ([#264](https://github.com/BobanL/dibbs-ecr-viewer/issues/264)) ([1d79d3a](https://github.com/BobanL/dibbs-ecr-viewer/commit/1d79d3a275b9452c7c7b701cd56e66765de1c811))
* Age calculation fixes (app-wide) ([#463](https://github.com/BobanL/dibbs-ecr-viewer/issues/463)) ([5f3e679](https://github.com/BobanL/dibbs-ecr-viewer/commit/5f3e6796fbc863decda582990ec964b1dd9dc541))
* do more with fhir-converter ([#10](https://github.com/BobanL/dibbs-ecr-viewer/issues/10)) ([e8523f5](https://github.com/BobanL/dibbs-ecr-viewer/commit/e8523f5facc94a56201cb475660c3c753bbc37b1))
* do something with fhir-converter ([#8](https://github.com/BobanL/dibbs-ecr-viewer/issues/8)) ([5f05478](https://github.com/BobanL/dibbs-ecr-viewer/commit/5f05478f0d74e9969f1fb535988a21eaea14f499))
* dual boot mode ([#568](https://github.com/BobanL/dibbs-ecr-viewer/issues/568)) ([2f4e518](https://github.com/BobanL/dibbs-ecr-viewer/commit/2f4e51879bb0a19556c3d20cc1c82b8f4b8e68ed))
* **ecr-viewer:** Add Keysely DB adapter ([#280](https://github.com/BobanL/dibbs-ecr-viewer/issues/280)) ([cf3ab1f](https://github.com/BobanL/dibbs-ecr-viewer/commit/cf3ab1fa464580b8dc2fdbf80f2a29c91b54e8f2))
* enable auth in middleware ([#349](https://github.com/BobanL/dibbs-ecr-viewer/issues/349)) ([613ffca](https://github.com/BobanL/dibbs-ecr-viewer/commit/613ffcae8fa0fcd447e4c92a7cc2826572aabdcb))
* make AZURE_CONTAINER_NAME optional in favor of ECR_BUCKET_NAME ([#560](https://github.com/BobanL/dibbs-ecr-viewer/issues/560)) ([c76fcab](https://github.com/BobanL/dibbs-ecr-viewer/commit/c76fcab5514bcee499757111543760c713b65f31))
* replace eRSD & RCKMS data with TES API data in TCRS ([#532](https://github.com/BobanL/dibbs-ecr-viewer/issues/532)) ([4e66412](https://github.com/BobanL/dibbs-ecr-viewer/commit/4e66412ff9173804f33eb54e70cb6960dc0228bc))
* replace STRING_AGG in order to support sqlserver 2016 ([#476](https://github.com/BobanL/dibbs-ecr-viewer/issues/476)) ([2aec965](https://github.com/BobanL/dibbs-ecr-viewer/commit/2aec965b47c40477b133b96803fcfc6c080bebf5))
* setup azure ad (aka entra id) provider ([#347](https://github.com/BobanL/dibbs-ecr-viewer/issues/347)) ([1ab22da](https://github.com/BobanL/dibbs-ecr-viewer/commit/1ab22dac8a5b99a3dc4e92c4394886c28abb400a))
* setup keycloak provider ([#346](https://github.com/BobanL/dibbs-ecr-viewer/issues/346)) ([942dcfe](https://github.com/BobanL/dibbs-ecr-viewer/commit/942dcfe405e88ca7d37d454cc1db187ee71af76d))
* simplify auth vars ([#511](https://github.com/BobanL/dibbs-ecr-viewer/issues/511)) ([717ccf4](https://github.com/BobanL/dibbs-ecr-viewer/commit/717ccf46a6164a731a9bb46637311ae29ada7290))


### Bug Fixes

* "eCR Library" should be a header to support screen readers ([#306](https://github.com/BobanL/dibbs-ecr-viewer/issues/306)) ([59a7bca](https://github.com/BobanL/dibbs-ecr-viewer/commit/59a7bca33c195132b919e9b3d2b0baa0236c64c5))
* add "no eCR" message when no data listed ([#330](https://github.com/BobanL/dibbs-ecr-viewer/issues/330)) ([c5e278b](https://github.com/BobanL/dibbs-ecr-viewer/commit/c5e278b2a5650863e59ee623f7d9f537c1080873))
* add revalidate on /health-check to force refresh ([#539](https://github.com/BobanL/dibbs-ecr-viewer/issues/539)) ([c44ca74](https://github.com/BobanL/dibbs-ecr-viewer/commit/c44ca74c7c8f3aafe5173742111f75e7fee89b37))
* anchor tag css and sidenav activation handling ([#320](https://github.com/BobanL/dibbs-ecr-viewer/issues/320)) ([c35557e](https://github.com/BobanL/dibbs-ecr-viewer/commit/c35557e9093cf0bf5e8489b2d598e7a6b46dc865))
* botched merge ([#332](https://github.com/BobanL/dibbs-ecr-viewer/issues/332)) ([242aa96](https://github.com/BobanL/dibbs-ecr-viewer/commit/242aa96fc5fb1e06dbe3102cdac575adfb877c1d))
* change ecr_viewer_url to use host.docker.internal ([#482](https://github.com/BobanL/dibbs-ecr-viewer/issues/482)) ([d93b038](https://github.com/BobanL/dibbs-ecr-viewer/commit/d93b038fa029f99f88741acfa69ffbaf2e4645c1))
* correct spelling of "Reportibility" to "Reportability"  ([#342](https://github.com/BobanL/dibbs-ecr-viewer/issues/342)) ([427ebc3](https://github.com/BobanL/dibbs-ecr-viewer/commit/427ebc3413aa9673169ea8e228ec51cd482c2435))
* Correctly get human readable condition names ([#283](https://github.com/BobanL/dibbs-ecr-viewer/issues/283)) ([58490a2](https://github.com/BobanL/dibbs-ecr-viewer/commit/58490a210328bf3f3d44930433dfd168ce7905fa))
* eCR Library wrapper is inaccessible when no eCRs are found ([#548](https://github.com/BobanL/dibbs-ecr-viewer/issues/548)) ([21e27ce](https://github.com/BobanL/dibbs-ecr-viewer/commit/21e27cea23b87a9decdf09f279122a2c54e05bac))
* Empty author practitioner ([#480](https://github.com/BobanL/dibbs-ecr-viewer/issues/480)) ([e4912b1](https://github.com/BobanL/dibbs-ecr-viewer/commit/e4912b18496fe3efdde5eee74cccc3cda7111aff))
* encounter date sorting ([#265](https://github.com/BobanL/dibbs-ecr-viewer/issues/265)) ([40e69e1](https://github.com/BobanL/dibbs-ecr-viewer/commit/40e69e13c7456ba260545ac1a673f8835a87fe86))
* generify vital sign evaluation and display ([#567](https://github.com/BobanL/dibbs-ecr-viewer/issues/567)) ([d6c41c8](https://github.com/BobanL/dibbs-ecr-viewer/commit/d6c41c8c1553de9bca5a3adb6e44a10f8eedf339))
* handle more phone number formats and fail more gracefully ([#561](https://github.com/BobanL/dibbs-ecr-viewer/issues/561)) ([b880773](https://github.com/BobanL/dibbs-ecr-viewer/commit/b8807733efcdfb4d36aff8d5c5bb4617e8a1d36b))
* library user preferences ([#406](https://github.com/BobanL/dibbs-ecr-viewer/issues/406)) ([ed17669](https://github.com/BobanL/dibbs-ecr-viewer/commit/ed176698f5d643f9e79ac52072f3aeff856588c6))
* Misc notes display bug ([#562](https://github.com/BobanL/dibbs-ecr-viewer/issues/562)) ([0415602](https://github.com/BobanL/dibbs-ecr-viewer/commit/0415602608f8e64006e0dd50aaa90086c4ff381f))
* my bad merge ([#313](https://github.com/BobanL/dibbs-ecr-viewer/issues/313)) ([3359a0c](https://github.com/BobanL/dibbs-ecr-viewer/commit/3359a0cb81b8acd4fd9d7dff0ab086efa02042c4))
* next-auth url base path to be dynamic ([#506](https://github.com/BobanL/dibbs-ecr-viewer/issues/506)) ([e186dc8](https://github.com/BobanL/dibbs-ecr-viewer/commit/e186dc854334816e666debbe2ac0afb0bf89c5ee))
* pagination button hover styling ([#402](https://github.com/BobanL/dibbs-ecr-viewer/issues/402)) ([630c143](https://github.com/BobanL/dibbs-ecr-viewer/commit/630c1438ac81fb2fe171ebc449d3f74c0445d893))
* patient information won't display when values are missing ([#271](https://github.com/BobanL/dibbs-ecr-viewer/issues/271)) ([11fdbec](https://github.com/BobanL/dibbs-ecr-viewer/commit/11fdbecc36c6f3be4a24d181174f66d3e2cf10a5))
* phdi =&gt; dibbs-ecr-viewer ([#419](https://github.com/BobanL/dibbs-ecr-viewer/issues/419)) ([4a92b34](https://github.com/BobanL/dibbs-ecr-viewer/commit/4a92b34f4d8486fd0dc5eea02ba9d4434b2788dd))
* process-zip saving metadata ([#553](https://github.com/BobanL/dibbs-ecr-viewer/issues/553)) ([0172fbf](https://github.com/BobanL/dibbs-ecr-viewer/commit/0172fbfdbf91f3d13c3542093a0b114a7bd9b474))
* remove debug console log from saveMetadataToSqlServer function ([#316](https://github.com/BobanL/dibbs-ecr-viewer/issues/316)) ([bf028e8](https://github.com/BobanL/dibbs-ecr-viewer/commit/bf028e8a7533e93770344249d47feb4795b15329))
* remove unnecessary key on `Header` ([#338](https://github.com/BobanL/dibbs-ecr-viewer/issues/338)) ([14f484e](https://github.com/BobanL/dibbs-ecr-viewer/commit/14f484eb720e9641feff3ab461e18236ef0a9c83))
* remove unnecessary key on filter condition div ([#396](https://github.com/BobanL/dibbs-ecr-viewer/issues/396)) ([1c864cc](https://github.com/BobanL/dibbs-ecr-viewer/commit/1c864cc92c100ba987925dca5074427c48d8af7c))
* remove unused /fhir-api REST api route ([#572](https://github.com/BobanL/dibbs-ecr-viewer/issues/572)) ([7279418](https://github.com/BobanL/dibbs-ecr-viewer/commit/72794189bad7cb5e4c3973dc331b623b665453ef))
* rename report_date to encounter_date in EcrTableClient ([#308](https://github.com/BobanL/dibbs-ecr-viewer/issues/308)) ([29135f7](https://github.com/BobanL/dibbs-ecr-viewer/commit/29135f757622c86a715c784db7edce3c9be10d99))
* Reportability Summary table should not be visible when no data is available ([#452](https://github.com/BobanL/dibbs-ecr-viewer/issues/452)) ([7b6beb0](https://github.com/BobanL/dibbs-ecr-viewer/commit/7b6beb01471a1755d3f1d493d91188ab4cc312d2))
* restore ecr library table stickiness ([#405](https://github.com/BobanL/dibbs-ecr-viewer/issues/405)) ([162f17a](https://github.com/BobanL/dibbs-ecr-viewer/commit/162f17a5194458e7a242299608fafb1f04312233))
* side nav scroll ([#491](https://github.com/BobanL/dibbs-ecr-viewer/issues/491)) ([03dc19d](https://github.com/BobanL/dibbs-ecr-viewer/commit/03dc19d5dd0d1400a1bf9ce8408b45efd1da8570))
* update aria-labels to filter buttons when active ([#471](https://github.com/BobanL/dibbs-ecr-viewer/issues/471)) ([c796864](https://github.com/BobanL/dibbs-ecr-viewer/commit/c79686439809e8364e43f34135cdc67a10f45efa))
* update back button image to be aria hidden ([#314](https://github.com/BobanL/dibbs-ecr-viewer/issues/314)) ([4d8af71](https://github.com/BobanL/dibbs-ecr-viewer/commit/4d8af7118adc2c2f00a4b47ce00967dfa5082df3))
* update heading levels and move Immunizations to under Clinical S… ([#333](https://github.com/BobanL/dibbs-ecr-viewer/issues/333)) ([d381e5f](https://github.com/BobanL/dibbs-ecr-viewer/commit/d381e5f5e3b79bea195859dae13385d8dec52e7f))
* use latest fhir converter to escape warning text ([#500](https://github.com/BobanL/dibbs-ecr-viewer/issues/500)) ([0bfda42](https://github.com/BobanL/dibbs-ecr-viewer/commit/0bfda42052d342cc49bd66af4a9426c1d28909fe))
* use onset age if available, only calculate if date present ([#414](https://github.com/BobanL/dibbs-ecr-viewer/issues/414)) ([bce4f01](https://github.com/BobanL/dibbs-ecr-viewer/commit/bce4f01c64cfae2004a66a0a467a6b098fa86343))


### Performance Improvements

* make ecr viewer page ssr ([#266](https://github.com/BobanL/dibbs-ecr-viewer/issues/266)) ([0ce9643](https://github.com/BobanL/dibbs-ecr-viewer/commit/0ce9643597aecd5293bde4647bdce6993fd5e536))

## [3.3.0](https://github.com/BobanL/dibbs-ecr-viewer/compare/v3.2.0...v3.3.0) (2025-04-02)


### Features

* do more with fhir-converter ([#10](https://github.com/BobanL/dibbs-ecr-viewer/issues/10)) ([e8523f5](https://github.com/BobanL/dibbs-ecr-viewer/commit/e8523f5facc94a56201cb475660c3c753bbc37b1))

## [3.2.0-beta3](https://github.com/BobanL/dibbs-ecr-viewer/compare/v3.1.0-beta3...v3.2.0-beta3) (2025-04-02)


### Features

* add new redirect handler in next auth ([#4](https://github.com/BobanL/dibbs-ecr-viewer/issues/4)) ([63f4e53](https://github.com/BobanL/dibbs-ecr-viewer/commit/63f4e538a172d9e3e88f9fb1592d442c3d6695f2))
