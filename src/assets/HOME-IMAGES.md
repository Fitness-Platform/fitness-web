# Homepage photography

The approved “Daniela Brito — Homepage Redesign” PDF uses the existing `home-strength.png` and `home-editorial.png` assets. The implementation reuses these files without duplicating or generating additional images.

- `HomeHero` uses the squat photograph with a tall crop.
- `HomePrograms` uses the dumbbell portrait (left half of the editorial diptych), the squat photograph, and the outdoor photograph (right half of the diptych).
- `HomeAboutDaniela` uses a close portrait crop of the squat photograph, matching the reference and distinct from the Strength & Structure image.

These original assets were AI-generated and depict fictional models, not Daniela Brito. Replace them with her approved final photography when available. Crop classes live in the corresponding components under `src/features/public/components/`.

Program names, durations and copy follow the supplied reference. These are static public homepage content, not backend program data. Program calls to action and Start Your Journey use the existing `/register` route. Work With Me scrolls to the final call to action; no coaching booking workflow is implied.

Privacy, Terms and Instagram remain explicitly disabled link placeholders in `PublicFooter` until real, approved destinations are supplied. They do not navigate or fabricate legal content/social accounts.
