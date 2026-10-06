# Data review and additions

Keep the approved library separate from extraction drafts. For every new report, record the exact original source, named edition, page/report number, literal passage, grade with scholar attribution and rights. Review every route's narrator order and exact transmission formulas; never infer edges or grades from colour.

Source records require `id,title,reference,url,rights,provider,verifiedAt,evidence` and an approved URL. Shamela records also identify the edition. Every narrator field belongs to its own `narratorId` and source IDs. Missing dates/knowledge remain missing. A role is distinct from an appraisal. Full appraisal qualifications are retained.

Each chain has `nodes,links,isnad,sourcePassage,sourceIds`; parallel teachers are separate branches. Each edge names `from,to,wording,sourceIds`. Full published Arabic versions and translations require separate provenance; a translated matn cannot supply an absent isnad.

Run data validation, type checking and automated regression checks before adding a reviewed entry. Complete qualified scholarly and linguistic review before formal scientific approval. Test fixtures are isolated historical or synthetic input and do not authorize runtime evidence. See [source audit](SOURCE-REVIEW.md).
