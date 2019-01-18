import { Schema, arrayOf } from 'normalizr'

export const itemSchema = new Schema('items', {
    idAttribute: "_id",
})

export const visualizationSchema = new Schema('visualizations', {
    idAttribute: "_id",
})

visualizationSchema.define({
    items: arrayOf(itemSchema),
});

/*
 * For barFilters
*/

export const FooSchema = new Schema('foo', {
    idAttribute: "id"
})


export const Schemas = {
    VISUALIZATION: visualizationSchema,
    VISUALIZATION_ARRAY: arrayOf(visualizationSchema),
    ITEM: itemSchema,
    ITEM_ARRAY: arrayOf(itemSchema),
    BAR_FILTERS: {
        FOO: arrayOf(FooSchema),
    },
}

export default Schemas
