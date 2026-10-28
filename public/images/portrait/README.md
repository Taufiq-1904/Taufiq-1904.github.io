# Portraits

## The original photograph

`profile.jpg` is the real photograph (4:5, ideally at least 800 x 1000 px, face clearly visible). Its path is
`assets.profilePhoto` in `src/lib/assets.ts`. It is the identity reference for the four house portraits and the
stand-in shown for any house whose own portrait file is not here yet.

## The four house portraits (needed)

Each house shows its own version of the same person. Add these files in this folder; no code change is needed,
they are picked up automatically (paths are defined once, in `houseScenes` in `src/lib/theme/houses.ts`):

| House      | File                                  | Status |
| ---------- | ------------------------------------- | ------ |
| Gryffindor | `public/images/portrait/gryffindor.webp` | missing |
| Slytherin  | `public/images/portrait/slytherin.webp`  | missing |
| Ravenclaw  | `public/images/portrait/ravenclaw.webp`  | missing |
| Hufflepuff | `public/images/portrait/hufflepuff.webp` | missing |

Recommended: 4:5 portrait, 1000 x 1250 px or larger, WebP, under about 150 KB each. Other ratios work (the frame
crops with `object-fit: cover`; tune the focus point with `portrait.position` in `houses.ts`).

The four should read as the same real person in four settings: same face, face shape and age, with only house
styling (clothing colours, small accessories, background architecture, lighting) changing. Keep them suitable for
a professional portfolio. Do not recolour skin or reshape the face.

Until a house has its file, the frame shows `profile.jpg` with that house's frame, corners, particles and rim
light. In development a small tag on the portrait says which file is missing; visitors never see it
(`SHOW_PORTRAIT_PENDING_TAG` in `houses.ts`).
