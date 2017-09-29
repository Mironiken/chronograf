import React, {PropTypes} from 'react'
import RefreshingGraph from 'shared/components/RefreshingGraph'
import buildQuery from 'utils/buildQuery'
import VisualizationName from 'src/dashboards/components/VisualizationName'

const DashVisualization = (
  {
    axes,
    type,
    name,
    templates,
    timeRange,
    autoRefresh,
    onCellRename,
    queryConfig,
    editQueryStatus,
  },
  {source: {links: {proxy}}}
) =>
  <div className="graph">
    <VisualizationName defaultName={name} onCellRename={onCellRename} />
    <div className="graph-container">
      <RefreshingGraph
        axes={axes}
        type={type}
        query={buildQuery(proxy, queryConfig, timeRange)}
        templates={templates}
        autoRefresh={autoRefresh}
        editQueryStatus={editQueryStatus}
      />
    </div>
  </div>

const {arrayOf, func, number, shape, string} = PropTypes

DashVisualization.defaultProps = {
  name: '',
  type: '',
}

DashVisualization.propTypes = {
  name: string,
  type: string,
  autoRefresh: number.isRequired,
  templates: arrayOf(shape()),
  timeRange: shape({
    upper: string,
    lower: string,
  }).isRequired,
  queryConfig: shape({}).isRequired,
  editQueryStatus: func.isRequired,
  axes: shape({
    y: shape({
      bounds: arrayOf(string),
    }),
  }),
  onCellRename: func,
}

DashVisualization.contextTypes = {
  source: PropTypes.shape({
    links: PropTypes.shape({
      proxy: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default DashVisualization
