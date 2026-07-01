Please implement the services page section merge as discussed.

1. Remove the ServicesInternalLinks component from 
   src/modules/services/templates/index.tsx (stop rendering it 
   below ModernServicesGrid).

2. Keep ModernServicesGrid as the single services section. 
   Keep the "Complete care for your ride" heading as is.

3. Update the shortDescription for all 8 services (in both 
   src/lib/services-data.ts local fallback AND update the 
   corresponding Sanity documents if they already exist) with 
   the following text. This replaces whatever short description 
   currently exists:

   [paste the 8 descriptions above]

4. Confirm ServiceCard component still renders title + description 
   correctly with these updated strings, nothing should overflow 
   or get cut off on mobile.

5. After deploying, do NOT delete the ServicesInternalLinks 
   component file entirely yet, just stop importing/rendering it, 
   in case we want the pattern again elsewhere later.

Run build and confirm no errors before pushing.