
// items by _id, referenced by viz in viz.items
function items(state={}, action) {
    switch(action.type) {

        // completely replaced...
        case ActionTypes.REFRESH_VIZ_SUCCESS:
            return action.response.entities.items || state

        // updated items, replace them
        case ActionTypes.ADD_CONTEXT_SUCCESS:
        case ActionTypes.REMOVE_CONTEXT_SUCCESS:
        case ActionTypes.REPLACE_CONTEXT_SUCCESS:
            return {
                ...state,
                ...action.response.entities.items,
            };

        case ActionTypes.REMOVE_ITEM_SUCCESS:
            return _.omit(state, action.itemId);

        case ActionTypes.UPDATE_ITEM_SUCCESS:
            return _.merge(_.reduce(state, (result, value, key) => { 
                if(key == action.itemId){ return result }; 
                result[key] = value; 
                return result; 
            }, {}), action.response.entities.items)

        default:
            if (action.response && action.response.entities && action.response.entities.items) {
                return _.merge({}, state, action.response.entities.items)
            }

            return state
    }
}





/*
 * SELECTORS
 * See https://github.com/reactjs/reselect
 */

function getVisualizationById(visualizations, _id) {
    return visualizations[_id]
}

function getItemsByVizId(visualization, items) {
    let vizItems = _.pick(items, visualization.items)
    return _.map(vizItems, x => x) // to array
}

function getContextByVizId(visualization, context) {
    let vizContext = _.pick(context, visualization.context)
    return _.map(vizContext, x => x) // to array
}

export const idSelector = (state, props) => (
    (props.params && props.params.id) || props.id
)
export const activeVisualizationSelector = (state, props) => (
    state.entities.visualizations[(props.params && props.params.id) || props.id]
)

export const userSelector = state => state.user
export const visualizationsSelector = state => state.entities.visualizations
export const itemsSelector = state => state.entities.items
export const contextSelector = state => state.entities.context
export const contextFilterSelector = state => state.contextFilters
export const itemFilterSelector = state => state.itemFilters

// auth states
export const isLoggedIn = state => state.user && !_.isEmpty(state.user)
export const isAdmin = state => state.user && state.user.roles && state.user.roles.admin


/*
 * Only get visualizations owned by current user, which are not trashed
 */
export const myVisualizationsSelector = createSelector(
    visualizationsSelector,
    userSelector,
    (visualizations, user) => _.filter(visualizations, (viz) => (
        (viz.author._id === user._id) && !viz.archived
    ))
)


/*
 * Only visualizations with public=true and paginated by page
 */
export const publicVisualizationsSelector = createSelector(
    visualizationsSelector,
    publicVisualizationPaginationSelector,
    (visualizations, publicVisualizationPagination) => {
        return publicVisualizationPagination.ids.length ? publicVisualizationPagination.ids.map(id => visualizations[id]) : []
    })

export const visualizationItemSelector = createSelector(
    activeVisualizationSelector,
    itemsSelector,
    (activeVisualization, items) => {
        if (!activeVisualization) {
            return null
        }

        return getItemsByVizId(
            activeVisualization,
            items
        )
    }
)


