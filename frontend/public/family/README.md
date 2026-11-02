# Family photography

Generated with the built-in imagegen tool for this prototype. These are illustrative families, not the Morgan account members or account guides. JPEGs are stored locally so pages do not depend on a third-party image host. The original generated PNG files were retained outside the project.

Shared prompt direction: photorealistic editorial family photography for a premium family connectivity website; warm natural daylight, authentic everyday interaction, muted navy clothing, warm neutral environments, landscape composition with people grouped centrally for responsive cropping. No text, watermarks, logos, or collage.

Final scene prompts:

- `home.jpg`: A Black multigenerational family with deep brown and medium brown skin tones, two parents, a school-age child and a grandmother, sharing a tablet on their living-room sofa. Joyful candid expressions, natural hair textures, authentic home life.
- `planning.jpg`: A South Asian family with brown skin tones, two parents and their teenage daughter, planning a weekend trip at the kitchen table with a laptop, map and notebook. Warm candid interaction, relaxed modern everyday clothes.
- `outdoors.jpg`: Two parents and two school-age children on a relaxed weekend walk in a leafy park, sharing a laugh, one parent holding a phone casually at their side, candid and joyful.
- `responder.jpg`: A parent wearing an unbranded navy paramedic work shirt arriving home and warmly greeting their partner and school-age child at the front door, an everyday family reunion, no medical emergency or ambulance.

Used by `src/FamilyPhoto.jsx`, with scene selection by account section. Photographs are separate from household profile pictures and guide portraits.

## Distinct destination scenes

The additional photographs use the built-in imagegen tool with this shared direction: one wide editorial lifestyle photograph, authentic faces and believable anatomy, candid everyday interaction, faces grouped centrally for responsive cropping, no text, logos, watermarks, collage, or overlays.

Scene prompts:

- `internet.jpg`: A Black father and his school-age daughter joyfully playing a console video game together on a living-room sofa, controllers in their hands, candid side angle, warm afternoon window light, green and rust casual clothing, no visible game screen.
- `saving.jpg`: A Latina mother and her teenage son putting coins into a glass savings jar at a bright kitchen counter, candid three-quarter composition, warm natural daylight, soft terracotta and cream clothes. No text on the jar.
- `rewards.jpg`: An East Asian grandmother and her young grandson enjoying ice cream together at an outdoor neighborhood cafe, candid laughter, summer light, pale blue and warm yellow casual clothing, leafy city street in the background.
- `store.jpg`: An interracial family with a Black mother, white father, and teenage daughter choosing a smartphone together at a clean contemporary electronics shop, medium-wide candid view, neutral casual clothes, natural daylight, unbranded devices and store.

Each image is assigned to exactly one destination:

| Destination | Image |
| --- | --- |
| Home | home.jpg |
| Billing & payments | planning.jpg |
| Wireless plans | outdoors.jpg |
| Home internet | internet.jpg |
| Squirrel Fund | saving.jpg |
| Rewards | rewards.jpg |
| Feature store | store.jpg |
| FirstNet | responder.jpg |

Navigation cards and signup do not repeat these images. Other utility pages use their section icon artwork. Unknown section IDs deliberately render no photo rather than falling back to a repeated image.
